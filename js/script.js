 function getColorRating(points)
 {
 	var htmlTrust;

 	if (points>=80)
 	{
 		htmlTrust="<span class='excellentTint'> <i class='fa fa-circle-o'></i> Excellent </span>";
 	}
 	else if (points>=60 && points<80)
 	{
 		htmlTrust="<span class='goodTint'> <i class='fa fa-circle-o'></i> Good </span>";
 	}
 	else if (points>=40 && points<60)
 	{
 		htmlTrust="<span class='unsatisfactoryTint'> <i class='fa fa-circle-o'></i> Unsatisfactory </span>";
 	}
 	else if (points>=20 && points<40)
 	{
 		htmlTrust="<span class='unsatisfactoryTint'> <i class='fa fa-circle-o'></i> Poor </span>";
 	}
 	else if (points>=0 && points<20)
 	{
 		htmlTrust="<span class='veryPoorTint'> <i class='fa fa-circle-o'></i> Very poor </span>";
 	}

 	return htmlTrust;
 }

 function getAccuracyRating(trust)
 {
    var htmlTrust;

    if (trust>=80)
    {
        htmlTrust="<span class='excellentTint'> <i class='fa fa-circle-o'></i> "+trust+"% </span>";
    }
    else if (trust>=60 && trust<80)
    {
        htmlTrust="<span class='goodTint'> <i class='fa fa-circle-o'></i> "+trust+"% </span>";
    }
    else if (trust>=40 && trust<60)
    {
        htmlTrust="<span class='unsatisfactoryTint'> <i class='fa fa-circle-o'></i> "+trust+"% </span>";
    }
    else if (trust>=20 && trust<40)
    {
        htmlTrust="<span class='unsatisfactoryTint'> <i class='fa fa-circle-o'></i> "+trust+"% </span>";
    }
    else if (trust>=0 && trust<20)
    {
        htmlTrust="<span class='veryPoorTint'> <i class='fa fa-circle-o'></i> "+trust+"% </span>";
    }

    return htmlTrust;
 }

 function returnCategoryName(category)
 {
    html='';

    var arrayCategories={
            101 : ["Malware or viruses", 1],
            102 : ["Poor customer experience", 1],
            103 : ["Phishing", 1],
            104 : ["Scam", 1],
            105 : ["Potentially illegal", 1],
            201 : ["Misleading claims or unethical", 2],
            202 : ["Privacy risks", 2],
            203 : ["Suspicious", 2],
            204 : ["Hate, discrimination", 2],
            205 : ["Spam", 2],
            206 : ["Potentially unwanted programs", 2],
            207 : ["Ads/pop-ups", 2],
            301 : ["Online tracking", 3],
            302 : ["Alternative or controversial medicine", 3],
            303 : ["Opinions, religion, politics", 3],
            304 : ["Other", 3],
            401 : ["Adult content", 1],
            402 : ["Incidental nudity", 1],
            403 : ["Gruesome or shocking", 1],
            404 : ["Site for kids", 5],
            501 : ["Good site", 5],
    };

    if (arrayCategories[category][1]==1 || arrayCategories[category][1]==2 || arrayCategories[category][1]==4)
    {
        html="<span class='veryPoorTint'>"+arrayCategories[category][0]+"</span>";
    }
    else if (arrayCategories[category][1]==3)
    {
        html="<span class='unsatisfactoryTint'>"+arrayCategories[category][0]+"</span>";
    }
    else if (arrayCategories[category][1]==5)
    {
        html="<span class='goodTint'>"+arrayCategories[category][0]+"</span>";
    }

    return html;
 }

 function getData(website) {

    var wotApiUrl="http://api.mywot.com/0.4/public_link_json2?hosts="+website+"/&key=cda180d4ae06d49507d86258a3f668bb7db7eed7";
    
    $.ajax({
        url: wotApiUrl,
        type: 'GET',
        dataType: 'json'
    })
    .done(function(data) {

        if (!$.isEmptyObject(data))
        {
            $("#messages").html("");

            var resultContainer=$('#result_container');

            resultContainer.show();
            resultContainer.html("Website: "+website +"<br />");

            //trust
            if (data.hasOwnProperty(website))
            {
                if (data[website].hasOwnProperty(0))
                {
                    var result1=data[website][0][0];
                    var result1Trust=data[website][0][1];
                    var htmlTrust=getColorRating(result1);   
                    var htmlAccuracy=getAccuracyRating(result1Trust);

                    resultContainer.append("Trustworthiness: "+htmlTrust+" ("+result1+"/100)"+" with "+htmlAccuracy+" accuracy"+"<br />");
                }
                else
                {
                    resultContainer.append("Trustworthiness: No data found" +"<br />");
                }
            }
            else
            {
                resultContainer.append("Trustworthiness: No data found" +"<br />");
            }
                   
            if (data.hasOwnProperty(website))
            {
                if (data[website].hasOwnProperty(4))
                {
                    //child safety
                    var result4=data[website][4][0];
                    var result4Trust=data[website][4][1];
                    var htmlChildSafety=getColorRating(result4);  
                    var htmlChildSafetyAccuracy=getAccuracyRating(result1Trust); 

                    resultContainer.append("Child safety: "+htmlChildSafety+" ("+result4+"/100)"+" with "+htmlChildSafetyAccuracy+" accuracy"+"<br />"); 
                }
                else
                {
                    resultContainer.append("Child safety: No data found" +"<br />");
                }
             } 
             else
             {
                 resultContainer.append("Child safety: No data found" +"<br />");
             }

             if (data.hasOwnProperty(website))
             {
                if (data[website].hasOwnProperty('categories'))
                {
                    resultContainer.append("The site was mentioned in following categories: "); 

                    jQuery.each(data[website]['categories'], function(index, item) {
                        if (item>10)
                        {
                            var categoryName=returnCategoryName(index);

                            resultContainer.append(categoryName+', '); 
                        }
                    });
                }
             }
            
        }
        else
        {
            $("#messages").html('<div class="alert alert-danger" role="alert">'
                + 'The URL provided is invalid'
                + '</div>'
            );
        }
        
    })
    .fail(function(xhr, status, error) {
        alert(error);
    })
    .always(function() {
        $.LoadingOverlay("hide");
    });
    }

function handleClick(event)
{
    event.preventDefault();
    
    var website=$('#websiteUrl').val();

    if (website.length>0)
    {
        $("#messages").html("");

        var expression = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        var regex = new RegExp(expression);

        if (website.match(regex)) {
          $.LoadingOverlay("show");
          getData(website);
        } 
        else {
          
          $("#messages").html('<div class="alert alert-danger" role="alert">'
              + 'The URL provided is invalid'
              + '</div>'
          );

        }
    }
}

$(function() {
	  var submitButton = $(".submit_button");

	  submitButton.on({
	     "click": handleClick
	});
});