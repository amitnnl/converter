<#
.SYNOPSIS
    PressWebP Portable Local Server for Windows
    Zero dependencies required. Runs natively on any Windows 10/11/8/7 PC via built-in .NET HttpListener.
#>

[CmdletBinding()]
param(
    [int]$Port = 8080
)

$rootDir = $PSScriptRoot
if (-not $rootDir) {
    $rootDir = Get-Location
}

# Find an available port starting from $Port
function Get-AvailablePort([int]$startPort) {
    $p = $startPort
    while ($p -lt ($startPort + 50)) {
        try {
            $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $p)
            $listener.Start()
            $listener.Stop()
            return $p
        } catch {
            $p++
        }
    }
    return $startPort
}

$port = Get-AvailablePort -startPort $Port
$url = "http://127.0.0.1:$port/"
$browserUrl = "http://localhost:$port/"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".webp" = "image/webp"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".mp4"  = "video/mp4"
    ".webm" = "video/webm"
    ".ogg"  = "video/ogg"
    ".mov"  = "video/quicktime"
}

$httpListener = New-Object System.Net.HttpListener
$httpListener.Prefixes.Add("http://127.0.0.1:$port/")
try {
    $httpListener.Prefixes.Add("http://localhost:$port/")
} catch {}

try {
    $httpListener.Start()
} catch {
    Write-Host "Failed to start server on $url : $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

Write-Host ''
Write-Host '==================================================================' -ForegroundColor Cyan
Write-Host '  PRESSWEBP — PORTABLE NEWSROOM CONVERTER SERVER' -ForegroundColor Green
Write-Host '==================================================================' -ForegroundColor Cyan
Write-Host '  * Status:      Running (100% Local and Independent)' -ForegroundColor Yellow
Write-Host "  * Root Folder: $rootDir" -ForegroundColor White
Write-Host "  * URL:         $url" -ForegroundColor Cyan
Write-Host '  * Close this window or press Ctrl+C to stop the server.' -ForegroundColor Gray
Write-Host '==================================================================' -ForegroundColor Cyan
Write-Host ''

# Launch default browser
try {
    Start-Process $browserUrl
} catch {
    Write-Host "Could not auto-open browser. Please open $browserUrl manually." -ForegroundColor Yellow
}

# Main request loop
while ($httpListener.IsListening) {
    try {
        $context = $httpListener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($rawPath)) {
            $rawPath = "index.html"
        }

        # URL decode path
        $decodedPath = [System.Uri]::UnescapeDataString($rawPath).Replace('/', '\')
        $filePath = Join-Path $rootDir $decodedPath

        # Security check: prevent directory traversal
        $fullPath = [System.IO.Path]::GetFullPath($filePath)
        $rootFullPath = [System.IO.Path]::GetFullPath($rootDir)

        if (-not $fullPath.StartsWith($rootFullPath, [System.StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path $fullPath -PathType Leaf)) {
            $response.StatusCode = 404
            $response.StatusDescription = "Not Found"
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
            $response.Close()
            continue
        }

        $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
        $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }

        # Add CORS and caching headers
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Accept-Ranges", "bytes")
        $response.Headers.Add("Cache-Control", "no-cache")
        $response.ContentType = $contentType

        $fileStream = [System.IO.File]::OpenRead($fullPath)
        $fileLength = $fileStream.Length

        # Handle Byte Range Requests for smooth video seeking
        $rangeHeader = $request.Headers["Range"]
        if ($rangeHeader -and $rangeHeader.StartsWith("bytes=")) {
            $rangeVal = $rangeHeader.Substring(6)
            $rangeParts = $rangeVal.Split('-')
            $start = [int64]$rangeParts[0]
            $end = if ($rangeParts.Length -gt 1 -and -not [string]::IsNullOrWhiteSpace($rangeParts[1])) { [int64]$rangeParts[1] } else { $fileLength - 1 }

            if ($start -ge $fileLength -or $end -ge $fileLength -or $start -gt $end) {
                $response.StatusCode = 416 # Range Not Satisfiable
                $response.Headers.Add("Content-Range", "bytes */$fileLength")
                $fileStream.Close()
                $response.Close()
                continue
            }

            $rangeLength = ($end - $start) + 1
            $response.StatusCode = 206 # Partial Content
            $response.Headers.Add("Content-Range", "bytes $start-$end/$fileLength")
            $response.ContentLength64 = $rangeLength

            $fileStream.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
            $buffer = New-Object byte[] 65536
            $remaining = $rangeLength
            while ($remaining -gt 0) {
                $toRead = [int][Math]::Min($buffer.Length, $remaining)
                $bytesRead = $fileStream.Read($buffer, 0, $toRead)
                if ($bytesRead -le 0) { break }
                $response.OutputStream.Write($buffer, 0, $bytesRead)
                $remaining -= $bytesRead
            }
        } else {
            $response.StatusCode = 200
            $response.ContentLength64 = $fileLength
            $fileStream.CopyTo($response.OutputStream)
        }

        $fileStream.Close()
        $response.Close()
    } catch {
        if (-not $httpListener.IsListening) { break }
    }
}
