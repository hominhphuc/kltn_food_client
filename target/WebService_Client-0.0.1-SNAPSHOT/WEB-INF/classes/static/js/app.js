//declearing html elements

const imgDiv = document.querySelector('.profile-pic-div');
const img = document.querySelector('#image-upload-firebase');
const file = document.querySelector('#file-upload-firebase');
const uploadBtn = document.querySelector('#image-upload-btn');

file.addEventListener('change', function(){
    //this refers to file
    const choosedFile = this.files[0];

    if (choosedFile) {

        const reader = new FileReader(); //FileReader is a predefined function of JS

        reader.addEventListener('load', function(){
            img.setAttribute('src', reader.result);
        });

        reader.readAsDataURL(choosedFile);
    }
});