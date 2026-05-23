package br.com.dropmessage;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.getcapacitor.community.admob.AdMob;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import com.google.android.gms.ads.MobileAds;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Registrar o plugin AdMob
        registerPlugin(AdMob.class);
        registerPlugin(GoogleAuth.class);
        MobileAds.initialize(this, initializationStatus -> {
            // Callback de inicialização do AdMob
        });
    }
}
