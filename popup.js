document.getElementById('formatBtn').addEventListener('click', async () => {
    // const priority = document.getElementById('priority').value;
    
    const template = `
  h3. Шаги воспроизведения
  1. Go to...
  2. Click on...
  
  ### Ожидаемый результат
  ...
  
  **Фактический результат**
  ...
  
    `.trim();
  
    // Вставка в Jira
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text) => {
        // Для Jira Cloud (новый редактор)
        const jiraEditor = document.querySelector('[aria-label="Description"]') || 
                          document.querySelector('.ak-editor-content-area');
        if (jiraEditor) {
          jiraEditor.focus();
          document.execCommand('insertText', false, text);
        } else {
          alert('Откройте поле описания в Jira!');
        }
      },
      args: [template]
    });
  });


//###Окружение
// Chrome ${navigator.userAgent.match(/Chrome\/(\d+)/)[1]}, ${screen.width}x${screen.height}