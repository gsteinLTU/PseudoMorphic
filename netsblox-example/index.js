(function () {    
    var dialog;

    class PseudomorphicExample extends Extension {
        constructor(ide) {
            super('PseudomorphicExample');
        }

        onOpenRole() {
        }

        getSettings() {
            return [
                
            ];
        }

        getMenu() {
            return {
                'Show Dialog...': () => {
                    showDialog(dialog);
                },
            };
        }

        getCategories() {
            return [

            ];
        }

        getPalette() {
            return [
                
            ];
        }

        getBlocks() {
            return [

            ];
        }

        getLabelParts() {
            return [

            ];
        }

    }

    // Add CSS
    var element = document.createElement('link');
    element.setAttribute('rel', 'stylesheet');
    element.setAttribute('type', 'text/css');
    element.setAttribute('href', 'https://pseudomorphic.netsblox.org/style.css');
    document.head.appendChild(element);

    // Add JS
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = false;
    script.setAttribute('src', 'https://pseudomorphic.netsblox.org/script.js');
    script.onload = function() {
        // Find <content> element in dialog
        dialog = createDialog('Pseudomorphic Example');
        setupDialog(dialog);

        const contentElement = dialog.querySelector('content');
        contentElement.style.display = 'flex';
        contentElement.style['flex-flow'] = 'column';

        // Add some content to the dialog
        const title = document.createElement('h1');
        title.style.textAlign = 'center';
        title.textContent = 'Pseudomorphic Example';
        contentElement.appendChild(title);

        const description = document.createElement('p');
        description.style.textAlign = 'center';
        description.textContent = 'This is an example of a Pseudomorphic extension.';
        contentElement.appendChild(description);
    };
    
    document.head.appendChild(script);
    
    NetsBloxExtensions.register(PseudomorphicExample);
})();