document.addEventListener('DOMContentLoaded', function() {
    var dropdown = document.querySelector('.dropdown');
    var dropdownContent = document.querySelector('.dropdown-content');
    var dropdownLinks = dropdownContent.querySelectorAll('a');
    var visible = false;

    dropdown.addEventListener('click', function(event) {
        //event.stopPropagation(); // Prevent clicks inside dropdown from closing dropdown
        dropdownContent.style.display = visible ? "none" : "block";
        visible = !visible;
    });

    // Use event delegation to handle clicks on dropdown links
    dropdownContent.addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
            var index = Array.from(dropdownLinks).indexOf(event.target);
            setLanguage(index);
            // Hide the dropdown after language selection
            dropdownContent.style.display = "none";
            visible = false;
            event.stopPropagation(); // Prevent event from bubbling up to the dropdown
        }
    });

    // Close dropdown when clicking outside of it
    document.body.addEventListener('click', function(event) {
        if (visible && !dropdown.contains(event.target)) {
            dropdownContent.style.display = "none";
            visible = false;
        }
    });
});

function setLanguage(index) {
    var biotext =  document.getElementById("bio-text");
    var biolist = document.getElementById("bio-list");
    var biolistItems = biolist.querySelectorAll('li');
    var maintitle = document.getElementById("main-title");

    switch (index) {
        case 0:
            maintitle.innerText = "Ossian Stange";
            biolistItems[0].innerText = "Webbdesigner & apputvecklare 💻";
            biolistItems[1].innerText = "Civilingenjörsstudent på KTH 🎓";
            biolistItems[2].innerText = "Stockholm/Jönköping 📍";
            break;
        case 1:
            maintitle.innerText = "Ossian Stange";
            biolistItems[0].innerText = "Web Designer & App Developer 💻";
            biolistItems[1].innerText = "Computer Science student at KTH 🎓";
            biolistItems[2].innerText = "Stockholm/Jönköping 📍";
            break;
        case 2:
            maintitle.innerText = "Ossian Stange";
            biolistItems[0].innerText = "Web- und Appentwickler 💻";
            biolistItems[1].innerText = "Informatikstudent bei KTH 🎓";
            biolistItems[2].innerText = "Stockholm/Jönköping 📍";
            break;
        case 3:
            maintitle.innerText = "오시안 스탕애";
            biolistItems[0].innerText = "웹 개발자 및 앱 개발자 💻";
            biolistItems[1].innerText = "스웨덴왕립공과대학교 🎓";
            biolistItems[2].innerText = "스톡홀름 📍";
            break;
        case 4:
            maintitle.innerText = "オシアン スタンゲ";
            biolistItems[0].innerText = "情報工学を専攻しています 💻";
            biolistItems[1].innerText = "王立工科大学 🎓";
            biolistItems[2].innerText = "ストックホルム 📍";

            break;
        // Add more cases as needed
        default:
            maintitle.innerText = "Ossian Stange";
            biotext.innerHTML = "";
    }
}
