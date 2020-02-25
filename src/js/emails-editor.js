function EmailsEditor({idElement: id, mailCounter, btnDeleteInvalid, setEmail}) {
    if (document.getElementById(id)) {
        let emailArray = [],
            placeholder = "add more people...",
            domains = [
                "yandex.ru",
                "gmail.com",
                "mail.ru",
                "miro.com"
            ];

        // main wrapper
        let wrapperEmailsEditor = document.createElement("div");
        wrapperEmailsEditor.className = "wrapper_emailseditor";

        // head wrapper
        let headWrapper = document.createElement("div");
        headWrapper.className = "headwrapper_emailseditor";

        // head
        let headEmailsEditor = document.createElement("p");
        headEmailsEditor.className = "head_emailseditor";
        headEmailsEditor.innerHTML = "Share <b>Board name</b> with others";
        headWrapper.append(headEmailsEditor);

        // editor wrapper
        let editorWrapper = document.createElement("div");
        editorWrapper.className = "editorwrapper_emailseditor";
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
        let emailListUl = document.createElement("ul");
        editorWrapper.append(emailListUl);

        // email list generate from array
        function generateEmailList() {
            emailListUl.innerHTML = "";
            emailArray.map(item => {
                let li = document.createElement("li");
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(item)) {
                    li.innerHTML = "<span class='email__emailseditor'>" + item.toString() + "</span><span class='delete_emailseditor'/>";
                } else {
                    li.innerHTML = "<span class='email__emailseditor error'>" + item.toString() + "</span><span class='delete_emailseditor'/>";
                }
                emailListUl.append(li);

            });
        }

        // delete email on click at button
        document.getElementById(id).addEventListener("click", (el) => {
            if (el.target.classList.contains('delete_emailseditor')) {
                listenDeleteEmail(el.target.parentNode.querySelector('.email__emailseditor').innerHTML);
                el.target.parentNode.remove();
                emailArray = [...document.getElementById(id).querySelectorAll('li')];
                mailCounter ? mailCount() : false;
                haveEmails(emailArray);
            }
        });

        // create input for write emails
        let inputEmail = document.createElement("div");
        inputEmail.className = "inputemail_emailseditor";
        inputEmail.innerHTML = " ";
        inputEmail.setAttribute("contenteditable", true);
        editorWrapper.append(inputEmail);

        // insert placeholder in input
        let inputEmailPlaceholder = "<span class='inputemailplaceholder_emailseditor'>" + placeholder + "</span>";
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
        let footerWrapper = document.createElement("div");
        footerWrapper.className = "footer_emailseditor";

        // button Add Email
        let addEmail = document.createElement("button");
        addEmail.className = "addemail_emailseditor";
        addEmail.innerHTML = "Add email";
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
        let getEmailCount = document.createElement("button");
        getEmailCount.className = "getemailscount__emailseditor";
        getEmailCount.innerHTML = "Get emails count";
        getEmailCount.addEventListener("click", () => {
            let quantityValidEmail = 0;
            emailArray.map(item => {
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(item)) {
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
        const inputCounter = document.createElement("p");
        inputCounter.className = "inputcounter_emailseditor";
        inputCounter.innerText = emailArray.length;

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
            let btnDel = document.createElement('button');
            btnDel.className = "btndel_emailseditor";
            btnDel.innerHTML = "Delete all invalid emails";
            footerWrapper.append(btnDel);
            btnDel.addEventListener('click', () => {
                let validEmailArray = emailArray.filter((item) => {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(item)
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
