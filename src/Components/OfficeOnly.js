import React, { useEffect } from "react";

const OnlyOffice = () => {

    const id = "docxEditor";
    let documentserverUrl = "http://documentserver/";
    const config = {
        document: {
            fileType: "docx",
            title: "demo.docx",
            url: "https://d2nlctn12v279m.cloudfront.net/assets/docs/samples/demo.docx",
        },
        documentType: "word",
    };

   const argTypes = {
        documentType: {
            options: ["word", "cell", "slide"],
            control: { type: "select" },
        },
        editorConfig_lang: {
            options: [
                "en", "az", "be", "bg", "ca", "zh", "cs", "da", "nl", "fi",
                "fr", "gl", "de", "el", "hu", "id", "it", "ja", "ko", "lv",
                "lo", "nb", "pl", "pt", "ro", "ru", "sk", "sl", "es", "sv",
                "tr", "uk", "vi"
            ],
            control: { type: "select" },
        },
        type: {
            options: ["desktop", "mobile"],
            control: { type: "select" },
        },
        events_onAppReady: { action: 'onAppReady' },
        events_onDocumentReady: { action: 'onDocumentReady' },
        events_onDocumentStateChange: { action: 'onDocumentStateChange' },
        events_onError: { action: 'onError' }
    };

    const loadScript = async (url, id) => {
        return new Promise((resolve, reject) => {
            try {
                if (document.getElementById(id)) {
                    if (window.DocsAPI) return resolve(null);

                    let intervalHandler = setInterval(() => {
                        if (!window.DocsAPI) return;

                        clearInterval(intervalHandler);

                        return resolve(null);
                    }, 500);
                } else {
                    const script = document.createElement("script");
                    script.setAttribute("type", "text/javascript");
                    script.setAttribute("id", id);

                    script.onload = resolve;
                    script.onerror = reject;

                    script.src = url;
                    script.async = true;

                    document.body.appendChild(script);
                }
            } catch (e) {
                console.error(e);
            }
        });
    };

    const onLoad = () => {
        try {
            if (!window.DocsAPI) throw new Error("DocsAPI is not defined");
            if (window?.DocEditor?.instances[id]) {
                console.log("Skip loading. Instance already exists", id);
                return;
            }

            if (!window?.DocEditor?.instances) {
                window.DocEditor = { instances: {} };
            }

            let initConfig = Object.assign(config);

            const editor = window.DocsAPI.DocEditor(id, initConfig);
            window.DocEditor.instances[id] = editor;
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (window?.DocEditor?.instances[id]) {
            window.DocEditor.instances[id].destroyEditor();
            window.DocEditor.instances[id] = undefined;

            console.log("Important props have been changed. Load new Editor.");
            onLoad();
        }
    }, [
        documentserverUrl,
        JSON.stringify(config),
        config.document.fileType,
        config.document.title,
        config.documentType,
    ]);

    useEffect(() => {
        let url = documentserverUrl;
        if (!url.endsWith("/")) url += "/";

        const docApiUrl = "http://localhost/web-apps/apps/api/documents/api.js";
        loadScript(docApiUrl, "onlyoffice-api-script")
            .then(() => onLoad())
            .catch((err) => console.error(err));

        return () => {
            if (window?.DocEditor?.instances[id]) {
                window.DocEditor.instances[id].destroyEditor();
                window.DocEditor.instances[id] = undefined;
            }
        };
    }, []);

    return <div id={id}></div>;
};

OnlyOffice.defaultProps = {
    height: "100%",
    width: "100%",
};

export default OnlyOffice;
