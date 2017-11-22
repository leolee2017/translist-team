
$(document).ready(function(){
$('#fuck').click(function () {
console.log('2');
$.ajax({
        method:"GET",
        url:"http://luffy.ee.ncku.edu.tw:8570/gg",
        data:{sss:$('input[name=sstop]').val(),
        }}).done(function(data){
        document.getElementById('cost1').innerHTML=data.n1+"站:";
        document.getElementById('cost2').innerHTML=data.n2+"站:";
        document.getElementById('cost3').innerHTML=data.n3;
        document.getElementById('cost4').innerHTML=data.n4;
        })
        })
        })
