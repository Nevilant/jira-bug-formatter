document.getElementById('insertTemplate').addEventListener('click', async () => {
  const errorElement = document.getElementById('errorMessage');
  errorElement.style.display = 'none';
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['contentScript.js']
    });
    
  } catch (error) {
    errorElement.textContent = `Ошибка: ${error.message}`;
    errorElement.style.display = 'block';
    console.error('Ошибка вставки:', error);
  }
});