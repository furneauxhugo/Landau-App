
function getFormatedDate(originalDate){
 var d = new Date(originalDate*1000);
 var formated_date = d.toLocaleDateString();				 
 
 return formated_date;
}
