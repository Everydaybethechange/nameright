// ==UserScript==
// @name           NameRight
// @namespace      
// @description    
// @include        *
// @grant          GM_xmlhttpRequest
// ==/UserScript==

(function() {
  const apiKey = "INSERT_YOUR_API_KEY";  //As this is hypothetical, I never inserted one, however would love to hear feedbac
  const apiUrl = "https://translation.googleapis.com/language/translate/v2";
  const ttsUrl = "https://translate.google.com/translate_tts";
  const sourceLangCode = "auto";
  const targetLangCode = "en";

  // event listener
  document.addEventListener("mouseup", function() {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      GM_xmlhttpRequest({
        method: "POST",
        url: apiUrl,
        data: JSON.stringify({
          q: selectedText,
          target: targetLangCode,
          key: apiKey
        }),
        
        headers: {
          "Content-Type": "application/json"
        },
        
        onload: function(response) {
          let data = JSON.parse(response.responseText);
          let detectedLangCode = data.data.detections[0][0].language;
          
          //uses API to translate
          GM_xmlhttpRequest({
            method: "POST",
            url: apiUrl,
            data: JSON.stringify({
              q: selectedText,
              source: detectedLangCode,
              target: targetLangCode,
              key: apiKey
            }),
            headers: {
              "Content-Type": "application/json"
            },
            onload: function(response) {
              let data = JSON.parse(response.responseText);
              let translatedTxt = data.data.translations[0].translatedTxt;

              // Use Google Text-to-Speech API to play audio for the translated text
              let audio = new Audio(ttsUrl + "?ie=UTF-8&q=" + translatedTxt + "&tl=" + targetLangCode);
              audio.play();
            }
          
          });
        
        }
      
      });
    
    }
  
  });


})();
