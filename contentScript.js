(function() {
    // Шаблон в формате, который точно понимает Jira
    const template = `
<div data-node-type="heading" data-level="3">
    <strong>Предусловие</strong>
</div>
<ul data-node-type="list">
    <li data-node-type="listItem">Пользователь авторизован в системе</li>
</ul>
<div data-node-type="heading" data-level="3">
    <strong>Шаги воспроизведения</strong>
</div>
<ol data-node-type="orderedList">
    <li data-node-type="listItem">Откройте страницу X</li>
    <li data-node-type="listItem">Нажмите кнопку Y</li>
</ol>
<div data-node-type="heading" data-level="3">
    <strong>Ожидаемый результат</strong>
</div>
<div data-node-type="paragraph">Система должна выполнить действие Z</div>
<div data-node-type="heading" data-level="3">
    <strong>Фактический результат</strong>
</div>
<div data-node-type="paragraph">Система не реагирует</div>
    `.trim();

    // 1. Улучшенный поиск редактора
    const findEditor = () => {
        const editorSelectors = [
            // Новые версии Jira Cloud
            '[data-testid="ak-editor-content-area"]',
            '[aria-label="Description editor"]',
            // Стандартные селекторы
            '.ak-editor-content-area',
            '.css-1ifqrgl',
            // Старые версии
            '.jira-wikifield',
            '#description',
            // Резервные варианты
            '[role="textbox"]',
            '[contenteditable="true"]'
        ];

        for (const selector of editorSelectors) {
            const editor = document.querySelector(selector);
            if (editor) {
                console.log("Найден редактор по селектору:", selector);
                return editor;
            }
        }
        console.error("Редактор не найден. Проверенные селекторы:", editorSelectors);
        return null;
    };

    // 2. Надежная активация редактора
    const activateEditor = async (editor) => {
        // Полная имитация действий пользователя
        editor.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        editor.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        editor.focus();
        
        // Для contenteditable
        if (editor.contentEditable === 'true') {
            const range = document.createRange();
            range.selectNodeContents(editor);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
        
        // Ожидание стабилизации состояния
        await new Promise(resolve => setTimeout(resolve, 200));
    };

    // 3. Безопасная вставка контента
    const insertContent = (editor) => {
        try {
            // Создаем временный контейнер
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = template;
            
            // Очищаем редактор
            editor.innerHTML = '';
            
            // Постепенно добавляем содержимое
            while (tempDiv.firstChild) {
                editor.appendChild(tempDiv.firstChild);
            }
            
            return true;
        } catch (e) {
            console.error("Ошибка вставки:", e);
            return false;
        }
    };

    // 4. Принудительное обновление состояния
    const triggerStateUpdate = (editor) => {
        // Все необходимые события
        ['input', 'change', 'compositionend', 'keydown', 'keyup', 'blur', 'focus'].forEach(type => {
            editor.dispatchEvent(new Event(type, { bubbles: true }));
        });
        
        // Дополнительные меры
        setTimeout(() => {
            editor.scrollIntoView({ behavior: 'smooth' });
            editor.focus();
            editor.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }, 300);
    };

    // 5. Основной процесс
    (async () => {
        const editor = findEditor();
        if (!editor) {
            console.error("Не удалось найти редактор Jira");
            return;
        }

        try {
            // Активация
            await activateEditor(editor);
            
            // Вставка
            if (insertContent(editor)) {
                // Обновление состояния
                triggerStateUpdate(editor);
                console.log("Шаблон успешно вставлен");
            } else {
                console.error("Не удалось вставить шаблон");
            }
        } catch (error) {
            console.error("Критическая ошибка:", error);
        }
    })();
})();