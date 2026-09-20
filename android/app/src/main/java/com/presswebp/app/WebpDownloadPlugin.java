package com.presswebp.app;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.OutputStream;

/** Saves generated WebP files using Android's public Downloads provider. */
@CapacitorPlugin(name = "WebpDownload")
public class WebpDownloadPlugin extends Plugin {
    @PluginMethod
    public void saveWebp(PluginCall call) {
        String base64 = call.getString("base64");
        String filename = call.getString("filename", "converted_1x1.webp");

        if (base64 == null || base64.isEmpty()) {
            call.reject("No WebP data was provided.");
            return;
        }

        try {
            byte[] bytes = Base64.decode(base64, Base64.DEFAULT);
            ContentValues values = new ContentValues();
            values.put(MediaStore.MediaColumns.DISPLAY_NAME, filename);
            values.put(MediaStore.MediaColumns.MIME_TYPE, "image/webp");
            values.put(MediaStore.MediaColumns.RELATIVE_PATH,
                    Environment.DIRECTORY_DOWNLOADS + "/PressWebP");
            values.put(MediaStore.MediaColumns.IS_PENDING, 1);

            ContentResolver resolver = getContext().getContentResolver();
            Uri uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
            if (uri == null) {
                call.reject("Android could not create the download file.");
                return;
            }

            try (OutputStream output = resolver.openOutputStream(uri)) {
                if (output == null) throw new IllegalStateException("Could not open download file.");
                output.write(bytes);
                output.flush();
            }

            values.clear();
            values.put(MediaStore.MediaColumns.IS_PENDING, 0);
            resolver.update(uri, values, null, null);

            JSObject result = new JSObject();
            result.put("uri", uri.toString());
            result.put("filename", filename);
            call.resolve(result);
        } catch (Exception error) {
            call.reject("Unable to save the WebP to Downloads.", error);
        }
    }
}
