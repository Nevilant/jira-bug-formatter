document.getElementById("formatBtn").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: formatJiraText,
  });
});

function formatJiraText() {
  const descriptionField = document.querySelector('[data-testid="jira-issue-view.description.details"]');
  if (!descriptionField) {
    alert("Не удалось найти описание задачи.");
    return;
  }

  // Пример простого форматирования: оборачиваем в **жирный текст**
  const text = descriptionField.innerText;
  const formatted = `**${text}**`;

  // Здесь мы только ПЕЧАТАЕМ отформатированный текст
  console.log("Formatted text:", formatted);

  // TODO: заменить на реальное редактирование поля, если нужно
}
