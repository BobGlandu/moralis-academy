
var colors = Object.values(allColors())

var defaultDNA = {
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

// when page load
$( document ).ready(function() {
  $('#dnabody').html(defaultDNA.bodyColor);
  $('#dnahead').html(defaultDNA.headColor);
  $('#dnaears').html(defaultDNA.earsColor);
  $('#dnalegs').html(defaultDNA.legsColor);
    
  $('#dnashape').html(defaultDNA.eyesShape)
  $('#dnaactivity').html(defaultDNA.activity)
  $('#dnaprivacy').html(defaultDNA.privacy)
  $('#dnamouth').html(defaultDNA.mouthColor)
  $('#dnaanimation').html(defaultDNA.animation)
//   $('#dnaspecial').html(defaultDNA.lastNum)

  renderCat(defaultDNA)

  // $('.tabx .tab1').show().siblings().hide();
  // $("input[name='decoration'][value="+dna.activity+"]").prop("checked", true)
  $(".tab-menu input[value=1]").prop("checked", true)
  showTabs(1)

});

function getDna(){
    var dna = ''
    dna += $('#dnabody').html()
    dna += $('#dnahead').html()
    dna += $('#dnaears').html()
    dna += $('#dnalegs').html()
    
    dna += $('#dnashape').html()
    dna += $('#dnaactivity').html()
    dna += $('#dnaprivacy').html()
    dna += $('#dnamouth').html()
    dna += $('#dnaanimation').html()
    dna += $('#dnaspecial').html()

    return parseInt(dna)
}

function renderCat(dna){
  bodyColor(colors[dna.bodyColor], dna.bodyColor)
  $('#bodycolor').val(dna.bodyColor)

  headColor(colors[dna.headColor], dna.headColor)
  $('#headcolor').val(dna.headColor)

  earsColor(colors[dna.earsColor], dna.earsColor)
  $('#earscolor').val(dna.earsColor)

  legsColor(colors[dna.legsColor], dna.legsColor)
  $('#legscolor').val(dna.legsColor)

  eyeVariation(dna.eyesShape)
  $('#eyeshape').val(dna.eyesShape)

  legVariation(dna.activity)
  $("input[name='decoration'][value="+dna.activity+"]").prop("checked", true)

  opacityVariation(dna.privacy)
  $('#incognito').val(dna.privacy)

  mouthColor(colors[dna.mouthColor], dna.mouthColor)
  $('#mouthcolor').val(dna.mouthColor)

  animationVariation(dna.animation)
  $('#animation').val(dna.animation)

}





// Changing cat colors
$('#bodycolor').change(() => {
  var colorVal = $('#bodycolor').val()
  bodyColor(colors[colorVal], colorVal)
})

$('#headcolor').change(() => {
  var colorVal = $('#headcolor').val()
  headColor(colors[colorVal], colorVal)
})

$('#earscolor').change(() => {
  var colorVal = $('#earscolor').val()
  earsColor(colors[colorVal], colorVal)
})

$('#legscolor').change(() => {
  var colorVal = $('#legscolor').val()
  legsColor(colors[colorVal], colorVal)
})

$('#eyeshape').change(() => {
  var shapeVal = $('#eyeshape').val()
  eyeVariation(shapeVal)
})

$('#legshape').change(() => {
  var shapeVal = $('#legshape').val()
  legVariation(shapeVal)
})

$("input[name='decoration']").change(() => {
  var legVal = $("input[name='decoration']:checked").val()

  console.log('leg value: '+ legVal)
  legVariation(legVal)
})

$('#incognito').change(() => {
  var opacityVal = $('#incognito').val()
  opacityVariation(opacityVal)
})

$('#mouthcolor').change(() => {
  var colorVal = $('#mouthcolor').val()
  mouthColor(colors[colorVal], colorVal)
})

$('#animation').change(() =>{
  var animationVal = $('#animation').val()
  animationVariation(animationVal)
})


// Changing tabs
$(".tab-menu input").change(() => {
  var tabVal = $(".tab-menu input:checked").val()

  console.log('selected tab: '+ tabVal)

  showTabs(tabVal)

})

// random kitty button
$("#randomkitty").click(()=>{
  randomDNA = computeRandomKitty()

  renderCat(randomDNA)

  console.log('Created a random kitty with dna ' + getDna());
})

// default kitty button
$("#defaultkitty").click(()=>{
  renderCat(defaultDNA)  
})







