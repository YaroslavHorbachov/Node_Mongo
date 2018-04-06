var objSession = {};
var Root = document.querySelector('.preRoot');

function createCookie() {
    document.cookie = 'isAdmin=true';
    objSession.key = 'true'
}

function deleteCookie(){
    document.cookie = 'isAdmin' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    objSession.key = '';
}

function getLog(){
    Root.innerHTML = '';
    var ul = document.createElement('ul');
    var xhr  = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
       if(xhr.status === 200 && xhr.readyState === XMLHttpRequest.DONE && objSession.key === 'true'){
           xhr.responseText.split('\n').filter(row => row.length).forEach(row => {
               let li = document.createElement('li');
               li.innerText = row;
               ul.appendChild(li)
           });
           Root.appendChild(ul)
       }
    };
    xhr.open('get', '/log');
    xhr.send()
}

