window.addEventListener('DOMContentLoaded', function() {
    var dropdown = document.getElementById('dropdown');
  
    // Richiesta HTTP per ottenere il contenuto del file di testo
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var fileContent = xhr.responseText;
        console.log(fileContent);
        // Divide il contenuto del file in righe
        var lines = fileContent.split('\n');
  
        // Aggiungi le opzioni al menu a tendina
        lines.forEach(function(line) {
          var option = document.createElement('option');
          option.text = line.trim();
          dropdown.add(option);
        });
      }
    };
    xhr.open('GET', 'elenco_opzioni.txt', true);
    xhr.send();
  });