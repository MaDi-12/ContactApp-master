document.addEventListener('deviceready', function() {
    const addContactBtn = document.getElementById('addContactBtn');
    const importContactsBtn = document.getElementById('importContactsBtn');
    const exportContactsBtn = document.getElementById('exportContactsBtn');
    const searchInput = document.getElementById('searchInput');
    const contactForm = document.getElementById('contactForm');
    const contactFormContent = document.getElementById('contactFormContent');
    const cancelBtn = document.getElementById('cancelBtn');
    const contactList = document.getElementById('contactList');

    addContactBtn.addEventListener('click', () => {
        contactForm.style.display = 'flex';
    });

    cancelBtn.addEventListener('click', () => {
        contactForm.style.display = 'none';
    });

    contactFormContent.addEventListener('submit', function(event) {
        event.preventDefault();
        const newContact = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            email: document.getElementById('email').value,
            birthday: document.getElementById('birthday').value,
            photo: document.getElementById('photo').files[0]
        };
        saveContact(newContact);
        contactForm.style.display = 'none';
    });

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        filterContacts(query);
    });

    importContactsBtn.addEventListener('click', importContacts);
    exportContactsBtn.addEventListener('click', exportContacts);

    function saveContact(contact) {
        let photoData = '';
        if (contact.photo) {
            const reader = new FileReader();
            reader.onloadend = function() {
                photoData = reader.result;
                createContact(photoData);
            };
            reader.readAsDataURL(contact.photo);
        } else {
            createContact(photoData);
        }

        function createContact(photoData) {
            const newContact = navigator.contacts.create({
                displayName: `${contact.firstName} ${contact.lastName}`,
                name: {
                    givenName: contact.firstName,
                    familyName: contact.lastName
                },
                phoneNumbers: [{
                    type: 'mobile',
                    value: contact.phoneNumber,
                    pref: true
                }],
                emails: [{
                    type: 'home',
                    value: contact.email
                }],
                photos: photoData ? [{ type: 'base64', value: photoData }] : [],
                birthday: contact.birthday ? new Date(contact.birthday) : null
            });

            newContact.save(onSaveSuccess, onSaveError);

            function onSaveSuccess(contact) {
                displayContacts();
            }

            function onSaveError(contactError) {
                alert('Error saving contact: ' + contactError.code);
            }
        }
    }

    function filterContacts(query) {
        const items = contactList.getElementsByTagName('li');
        Array.from(items).forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? '' : 'none';
        });
    }

    function importContacts() {
        alert('Import Contacts feature is under development.');
    }

    function exportContacts() {
        alert('Export Contacts feature is under development.');
    }

    function displayContacts() {
        navigator.contacts.find(['*'], function(contacts) {
            contactList.innerHTML = '';
            contacts.forEach(contact => {
                const li = document.createElement('li');
                const now = new Date();
                const birthday = contact.birthday ? new Date(contact.birthday) : null;
                const isBirthday = birthday && now.getMonth() === birthday.getMonth() && now.getDate() === birthday.getDate();
                li.innerHTML = `
                    <span>${contact.displayName || ''}</span>
                    <span>${isBirthday ? '<i class="gift-icon">🎁</i>' : ''}</span>
                `;
                contactList.appendChild(li);
            });
        }, function(error) {
            alert('Error fetching contacts: ' + error.code);
        }, {multiple: true});
    }

    displayContacts();
});
