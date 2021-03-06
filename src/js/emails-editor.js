function EmailsEditor({idElement: id, mailCounter, btnDeleteInvalid, setEmail}) {
    if (document.getElementById(id)) {
        let emailArray = [],
            placeholder = "add more people...",
            domains = [
                "yandex.ru",
                "gmail.com",
                "mail.ru",
                "miro.com"
            ],
            regxEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

        // main wrapper
        let wrapperEmailsEditor = createEl('div', {'class': 'wrapper_emailseditor'});

        // head wrapper
        let headWrapper = createEl('div', {'class': 'headwrapper_emailseditor'});

        // head
        let headEmailsEditor = createEl('p', {'class': 'head_emailseditor'}, 'Share <b>Board name</b> with others');
        headWrapper.append(headEmailsEditor);

        // editor wrapper
        let editorWrapper = createEl('div', {'class': 'editorwrapper_emailseditor'});
        headWrapper.append(editorWrapper);

        // focus on the first click on empty editor wrapper
        editorWrapper.addEventListener("click", () => {
            if (inputEmail.querySelector('span') && inputEmail.querySelector('span').innerHTML === placeholder) {
                inputEmail.innerHTML = "";
                inputEmail.focus();
            }
        });

        // focus on the switch tab browser. otherwise placeholder is sent to the email list
        window.addEventListener("visibilitychange", () => {
            inputEmail.blur();
        });

        // insert ul
        let emailListUl = createEl('ul');
        editorWrapper.append(emailListUl);

        // email list generate from array
        function generateEmailList() {
            emailListUl.innerHTML = "";
            emailArray.map(item => {
                let li = createEl('li'),
                     classError = "";
                if (regxEmail.test(item)) {
                    classError = ""
                } else {
                    classError = "error"
                }
                li.innerHTML = `<span class='email__emailseditor ${classError}'>${item}</span><span class='delete_emailseditor'/>`;
                emailListUl.append(li);

            });
        }

        // delete email on click at button
        document.getElementById(id).addEventListener("click", (el) => {
            if (el.target.classList.contains('delete_emailseditor')) {
                let email = el.target.parentNode.querySelector('.email__emailseditor').innerHTML;
                listenDeleteEmail(email);
                el.target.parentNode.remove();
                let indexEmail = emailArray.findIndex( currentValue => currentValue === email);
                emailArray.splice(indexEmail, 1);
                mailCounter ? mailCount() : false;
                haveEmails(emailArray);
                inputEmail.blur();
            }
        });

        // create input for write emails
        let inputEmail = createEl('div', {'class': 'inputemail_emailseditor', 'contenteditable': true}, ' ');
        editorWrapper.append(inputEmail);

        // insert placeholder in input
        let inputEmailPlaceholder = `<span class='inputemailplaceholder_emailseditor'>${placeholder}</span>`;
        inputEmail.innerHTML = inputEmailPlaceholder;
        inputEmail.addEventListener('click', () => {
            if (inputEmail.querySelector('span') && inputEmail.querySelector('span').innerHTML === placeholder) {
                inputEmail.innerHTML = ""
            }
        });
        inputEmail.addEventListener('blur', () => {
            if (inputEmail.querySelector('span') == null && !inputEmail.innerHTML) {
                inputEmail.innerHTML = inputEmailPlaceholder
            } else {
                pushArrayEmail();
                inputEmail.innerHTML = inputEmailPlaceholder;
            }
        });

        // input event
        inputEmail.addEventListener("input", () => {
            if (inputEmail.innerHTML.indexOf(",") > -1) {
                pushArrayEmail()
            }
        });

        // event for keydown "Enter"
        inputEmail.addEventListener('keydown', (event) => {
            let keyNum;
            if (window.event) {
                keyNum = window.event.keyCode;
            } else if (e) {
                keyNum = e.which;
            }
            if (keyNum === 13) {
                event.preventDefault();
                pushArrayEmail()
            }
        });

        // add email to array
        function pushArrayEmail() {
            inputEmail.innerText.replace(/\r?\n?\s/g, "").split(",").map(item => {
                if (!emailArray.includes(item) && item && item !== placeholder.replace(/\r?\n?\s/g, "")) {
                    emailArray = [...emailArray, item];
                    inputEmail.innerHTML = "";
                    generateEmailList()
                } else {
                    inputEmail.innerHTML = "";
                }
            });
            mailCounter ? mailCount() : false;
        }

        // footer
        let footerWrapper = createEl('div', {'class': 'footer_emailseditor'});

        // button Add Email
        let addEmail = createEl('button', {'class': 'addemail_emailseditor'}, 'Add email');
        addEmail.addEventListener('click', addEmailRandom);
        function addEmailRandom() {
            let login = "",
                strong = 5,
                dic = "abcdefghijklmnopqrstuvwxyz1234567890",
                randomDomain = Math.floor(Math.random() * domains.length);
            for (let i = 0; i < strong; i++) {
                login += dic.charAt(Math.floor(Math.random() * dic.length));
            }
            emailArray.push(login + "@" + domains[randomDomain]);
            generateEmailList();
            mailCount();
        }

        // button Get Emails Count
        let getEmailCount = createEl('button', {'class': 'getemailscount__emailseditor'}, 'Get emails count');
        getEmailCount.addEventListener("click", () => {
            let quantityValidEmail = 0;
            emailArray.map(item => {
                if (regxEmail.test(item)) {
                    quantityValidEmail += 1;
                }
            });
            quantityValidEmail > 0 ? alert("Valid Email: " + quantityValidEmail) : alert("Not valid Email");
        });

        // footer append
        footerWrapper.append(addEmail, getEmailCount);

        // main append
        wrapperEmailsEditor.append(headWrapper, footerWrapper);
        document.getElementById(id).append(wrapperEmailsEditor);


        // Option: input counter
        const inputCounter = createEl('p', {'class': 'inputcounter_emailseditor'}, emailArray.length);

        function mailCountCreate() {
            if (mailCounter) {
                editorWrapper.before(inputCounter);
            }
        }
        function mailCount() {
            if (mailCounter) {
                inputCounter.innerText = emailArray.length;
            }
        }

        // Option: button for delete all invalid email
        if (btnDeleteInvalid) {
            let btnDel = createEl('button', {'class': 'btndel_emailseditor'}, 'Delete all invalid emails');
            footerWrapper.append(btnDel);
            btnDel.addEventListener('click', () => {
                let validEmailArray = emailArray.filter((item) => {
                    return regxEmail.test(item)
                });
                emailArray = validEmailArray;
                generateEmailList();
                mailCount();
            })
        }

        // Set a list of emails
        function setList() {
            if (setEmail) {
                for (let i = 0; i < setEmail; i++) {
                    addEmailRandom()
                }
            }
        }

        // Listener: delete
        function listenDeleteEmail(e) {
            console.log("LISTENER. Deleted: " + e)
        }

        // Listener: actual emails
        function haveEmails(e) {
            console.log("LISTENER. Have emails: ");
            console.log(e);
        }

        // Events onload page
        window.addEventListener("load", () => {
            generateEmailList();
            mailCountCreate();
            setList();
            mailCount();
        });

    }
}


// Constructor Create Elements
function createEl(tag, attributes, inner) {
    let element = document.createElement(tag)
    if (attributes) {
        for (let key in attributes) {
            element.setAttribute(key, attributes[key])
        }
    }
    if (inner) {
        element.innerHTML = inner
    }
    return element
}