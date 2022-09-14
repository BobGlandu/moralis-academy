
//Random color
function getColor() {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return randomColor
}

function genColors(){
    var colors = []
    for(var i = 10; i < 99; i ++){
      var color = getColor()
      colors[i] = color
    }
    return colors
}


function bodyColor(color,code) {
    $('.catbody').css('background-color', '#' + color)  //This changes the color of the cat
    $('#bodycode').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnabody').html(code) //This updates the body color part of the DNA that is displayed below the cat
}


//This function code needs to modified so that it works with Your cat code.
function headColor(color,code) {
    $('#head').css('background-color', '#' + color)  //This changes the color of the cat head
    $('#headcode').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnahead').html(code) //This updates the body color part of the DNA that is displayed below the cat
}


function earsColor(color,code) {
    $('.ear').css('background-color', '#' + color)  //This changes the color of the cat ears
    $('#earscode').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnaears').html(code) //This updates the body color part of the DNA that is displayed below the cat
}


function legsColor(color,code) {
    $('.legs').css('background-color', '#' + color)  //This changes the color of the cat legs
    $('#legscode').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnalegs').html(code) //This updates the body color part of the DNA that is displayed below the cat
}



//###################################################
//Functions below will be used later on in the project
//###################################################
function eyeVariation(n) {
    num = parseInt(n)
    $('#dnashape').html(num)

    switch (num) {
        case 1:
            normalEyes()
            $('#eyeshapecode').html('Basic')
            break;
        case 2:
            startledEyes()
            $('#eyeshapecode').html('Startled')
            break;
        case 3:
            blindEyes()
            $('#eyeshapecode').html('Blind')
            break;
    }
}

function legVariation(n) {
    num = parseInt(n)
    $('#dnaactivity').html(n)

    switch (num){
        case 1:
            runLegs()
            $('#legshapecode').html("Run")
            break;
        case 2:
            restLegs()
            $('#legshapecode').html("Rest")
            break;
        default:
    }
}




function runLegs(){
    $('#leg1').css({
        "width": "23px",
        "height": "52px",
        "top": "87px",
        "left": "148px",
        "transform": "rotate(-40deg)"        
    })

    $('#leg2').css({
        "width": "23px",
        "height": "52px",
        "top": "78px",
        "left": "179px",
        "transform": "rotate(-50deg)"       
    })

}

function restLegs(){
    $('#leg1').css({
        "width": "23px",
        "height": "52px",
        "top": "87px",
        "left": "21px",
        "transform": "rotate(15deg)"
    })

    $('#leg2').css({
        "width": "23px",
        "height": "52px",
        "top": "90px",
        "left": "62px",
        "transform": "rotate(-10deg)"
    })

}

function opacityVariation(num){
    $('#dnaprivacy').html(num)

    opacity = (10-num)/10
 
    $('.cat').css("opacity", opacity)
    $('#incognitocode').html(num*10 + '%')

}

function mouthColor(color,code) {
    $('.mouth').css('background-color', '#' + color)  //This changes the color of the cat head
    $('#mouthcolorcode').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnamouth').html(code) //This updates the body color part of the DNA that is displayed below the cat
}


function animationVariation(n){
    num = parseInt(n)
    $('#dnaanimation').html(num)

    switch(num){
        case 0:
            $('#animationcode').html("still")
            resetAnimations()
            break;
        case 1:
            $('#animationcode').html("flee")
            animateLegs()
            break;
        case 2:
            $('#animationcode').html("hide")
            animateHide()
            break;
        default:
            resetAnimations()

    }
}


function animateLegs(){
    $('#leg1').addClass("runningleg1")
    $('#leg2').addClass("runningleg2")
}


function animateHide(){
    $('.cat').addClass("hiding")
}

function resetAnimations(){
    $('#leg1').removeClass("runningleg1")
    $('#leg2').removeClass("runningleg2")
    $('.cat').removeClass("hiding")
}

function decorationVariation(num) {
    $('#dnadecoration').html(num)
    switch (num) {
        case 1:
            $('#decorationName').html('Basic')
            normaldecoration()
            break
    }
}

async function normalEyes() {

    $('.pupils').css({
        "background-color": "black",
        "width": "20px",
        "height": "30px",
        "top": "10px",
        "left": "24px"
    })

}


function startledEyes() {
    
    $('.pupils').css({
        "background-color": "black",
        "width": "45px",
        "height": "45px",
        "top": "3px",
        "left": "3px"
    })
}

function blindEyes() {
    
    $('.pupils').css({
        "background-color": "white"
    })
}


async function normaldecoration() {
    //Remove all style from other decorations
    //In this way we can also use normalDecoration() to reset the decoration style
    $('.cat__head-dots').css({ "transform": "rotate(0deg)", "height": "48px", "width": "14px", "top": "1px", "border-radius": "0 0 50% 50%" })
    $('.cat__head-dots_first').css({ "transform": "rotate(0deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "50% 0 50% 50%" })
    $('.cat__head-dots_second').css({ "transform": "rotate(0deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "0 50% 50% 50%" })
}



function showTabs(tabVal){
    
    num = parseInt(tabVal)
    switch (num) {
        case 1:
            $("#tab-colors").show()
            $("#tab-cattributes").hide()
            break;
        case 2:
            $("#tab-colors").hide()
            $("#tab-cattributes").show()
            break;
        default:
            console.log('Wrong tab selection')
    }
}


function computeRandomKitty(){


    var randomDNA = {
        //Colors
        "bodyColor" : 95,
        "headColor" : 10,
        "earsColor" : 92,
        "legsColor" : 92,
        //Cattributes
        "eyesShape" : 1,
        "activity" : 1,
        "privacy" : 0,
        "mouthColor" : 73,
        "animation" :  0,
        "lastNum" :  1
        }
    
    //Colors    
    randomDNA.bodyColor = Math.floor(Math.random()*88+10)
    randomDNA.headColor = Math.floor(Math.random()*88+10)
    randomDNA.earsColor = Math.floor(Math.random()*88+10)
    randomDNA.legsColor = Math.floor(Math.random()*88+10)

    //Cattributes
    randomDNA.eyesShape = Math.floor(Math.random()*3+1)
    randomDNA.activity =  Math.floor(Math.random()*2+1)
    randomDNA.privacy = Math.floor(Math.random()*11)
    randomDNA.mouthColor = Math.floor(Math.random()*90+1)
    randomDNA.animation = Math.floor(Math.random()*3)

    return randomDNA
}

