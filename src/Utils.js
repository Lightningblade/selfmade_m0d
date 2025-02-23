import Settings from "./Settings";
let filterHTML = require("./template/filter.html");

export default class Utils
{
    constructor()
    {
        let _this = this;
        this.createFilter();

        this.createNotificationbox();

        window.addEventListener("commentsReady", function()
        {
            _this.addBlockTagSign();
            _this.addBlockUserSign()
            setTimeout(function(){_this.getRating()}, 10);
        });

        window.addEventListener("userReady", function()
        {
            _this.addBlockUserSign(true);  
        })
    }

    createFilter()
    {
        $(".filter-setting:last").after(filterHTML);

        let filter = $(".filter-setting:last");

        $("#filter-link").click(function()
        {
            if(Settings.settings.isActive)
                filter.addClass("active");
            else
                filter.removeClass("active"); 
        });
        
        $(".filter-setting:last").click(function()
        {
            $(".filter-setting:last").toggleClass("active")
            Settings.settings.isActive = !Settings.settings.isActive;
            Settings.quickSave();
        });
    }

    static createNameTag(element, data)
    {
        let wrapper = document.createElement("span");
        $(wrapper).addClass("tag");
        
        $(wrapper).text(data);
    
        let x = document.createElement("a");
    
        $(x).href="#";
        $(x).html("&nbsp;&nbsp;x");
        $(x).css("color","red");
    
        $(x).click(function(e)
        {
            e.preventDefault();
            $(this).parent().remove();
        });
    
        wrapper.append(x);
    
        element.value = "";
    
        $(element).prev().append(wrapper);
    }

    createNotificationbox()
    {
        let notificationbox = document.createElement("div");
        $(notificationbox).addClass("selfmade_m0d");
        notificationbox.id = "notificationbox";
        $("body").append(notificationbox);
    }

    static showNotification(text, location = "")
    {
        let _this = this;
        if(Settings.settings.activateNotifications)
        {
            let element = document.createElement("span");
            element.id = "notification";
            $(element).addClass("selfmade_m0d");
            $(element).attr("data-href", location);
            element.innerText = text;

            $("#notificationbox").append(element);
            $(element).slideToggle();

            $(element).click(function(e)
            {
                let location = $(this).attr("data-href");
                if(location != "")
                {
                    Settings.settings.isActive = false;
                    Utils.pr0gramm.navigateTo(location,0);
                    setTimeout(function()
                    {
                        Settings.settings.isActive = true;
                    },10); 
                }
                $(this).animate(
                {
                    left: "-300px"
                },function()
                {
                    this.remove()
                });
            });

            $(element).contextmenu(function()
            {
                $(this).animate(
                {
                    left: "-300px"
                },function()
                {
                    this.remove()
                });
                return false;
            });
        
            setTimeout(function()
            {
                $(element).animate(
                {
                    left: "-300px"
                },function()
                {
                    element.remove()
                });
            },Settings.settings.notificationDuration*1000);
        }
    }

    addBlockTagSign()
    {
        let blockTagSign = document.createElement("span");
        blockTagSign.className = "block-tag"
        blockTagSign.innerText = "ø";
        if($(".block-tag").length == 0)
        {
            $(".tag").append(blockTagSign);
            $(".block-tag").css("cursor", "pointer");
    
            $(".block-tag").each(function()
            {
                let tmp = $(this).siblings()[0].innerText;
                if(Settings.settings.blockedTags.includes(tmp.toLowerCase()))
                {
                    $(this).css("color", "red");
                }   
                else
                {
                    $(this).css("color", "#888");
                }
            });
    
            $(".block-tag").click(function()
            {
                let tmp = $(this).siblings()[0].innerText;
                if($(this).css("color") == "rgb(255, 0, 0)")
                {
                    Settings.settings.blockedTags.splice(Settings.settings.blockedTags.indexOf(tmp),1);
                    if(Settings.settings.blockedTags.length > 0)
                        Settings.settings.skipUploadByTag  = true;
                    else
                        Settings.settings.skipUploadByTag  = false;
                    $(this).css("color","#888" );
                }
                else
                {
                    Settings.settings.blockedTags.push(tmp.toLowerCase());
                    Settings.settings.skipUploadByTag  = true;
                    $(this).css("color", "red");
                }
                
                Settings.quickSave();
            });
        }
    }
    
    addBlockUserSign(userpage=false)
    {
        let blockUserSign = document.createElement("span");
        blockUserSign.className = "block-user";
        blockUserSign.innerText = " ø";
        if($(".block-user").length == 0)
        {
            if(userpage)
            {
                if($(".user-head span")[0] == undefined)
                    return;
                $(".user-head span")[0].before(blockUserSign);
            }
                
            else
                $(blockUserSign).insertAfter($(".user:not(.user-mark)"));

            $(".block-user").css("cursor", "pointer");
            if(userpage)
            {
                let text = $(".block-user").parent().text().trim();
                text = text.substr(0, text.indexOf(" ")).toLowerCase();
                if(Settings.settings.blockedUsers.includes(text))
                {
                    $(".block-user").css("color", "red");
                }

                $(".block-user").click(function()
                {        
                    let user = $(".block-user").parent().text().trim();
                    user = user.trim().substr(0, user.indexOf(" ")).toLowerCase();
                    if($(this).css("color") == "rgb(255, 0, 0)")
                    {
                        Settings.settings.blockedUsers.splice(Settings.settings.blockedUsers.indexOf(user),1);
                        if(Settings.settings.blockedUsers.length > 0)
                            Settings.settings.skipUploadByUser  = true;
                        else
                            Settings.settings.skipUploadByUser  = false;
                        $(this).css("color","" );
                    }
                    else
                    {
                        Settings.settings.blockedUsers.push(user.toLowerCase());
                        Settings.settings.skipUploadByUser  = true;
                        $(this).css("color", "red");
                    }      
                    Settings.quickSave();
                });
            }
            else
            {
                $(".block-user").each(function()
                {
                    if(Settings.settings.blockedUsers.includes($(this).prev()[0].innerText.toLowerCase()))
                    {
                        $(this).css("color", "red");
                    }
                });
                
                $(".block-user").click(function()
                {
                    let user = $(this).prev()[0].innerText;
        
                    if($(this).css("color") == "rgb(255, 0, 0)")
                    {
                        Settings.settings.blockedUsers.splice(Settings.settings.blockedUsers.indexOf(user),1);
                        if(Settings.settings.blockedUsers.length > 0)
                            Settings.settings.skipUploadByUser  = true;
                        else
                            Settings.settings.skipUploadByUser  = false;
                        $(this).css("color","" );
                    }
                    else
                    {
                        Settings.settings.blockedUsers.push(user.toLowerCase());
                        Settings.settings.skipUploadByUser  = true;
                        $(this).css("color", "red");
                    }      
                    Settings.quickSave();
                });
            }
    
            
        }
    }

    static nextUpload()
    {
        if(Settings.settings.nextUploadDirection == 1)
        {
            $(".stream-prev").click();
        }
        else if(Settings.settings.nextUploadDirection == -1)
        {
            $(".stream-next").click();
        }
    }

    static rateUpload(direction = -1)
    {
        Utils.showNotification("Upload wurde bewertet");
        if(direction == 1)
        {
            if($(".item-vote:has(.pict)")[0].className.indexOf("voted-up") == -1)
                $(".item-vote:has(.pict) .vote-up").click();
        }
        else if(direction == -1)
        {
            if($(".item-vote:has(.pict)")[0].className.indexOf("voted-down") == -1)
                $(".item-vote:has(.pict) .vote-down").click();
        }
    }

    static getTags()
    {
        let tags = [];
        let rawTags;
    
        if(Settings.settings.onlyGoodTags == true)
        {
            rawTags = $(".tag-good");
        }
        else
        {
            rawTags = $(".tag-good,.tag-bad");
        }

        let amount = Settings.settings.amountOfTagsChecked;
        if(amount == -1)
        {
            amount = rawTags.length;
        }
        else
        {
            amount = Math.min(amount, rawTags.length)
        }
    
        for(let i = 0; i <amount; i++)
        {
            tags.push(rawTags[i].children[0].innerText);
        }
        return tags;
    }

    static getTotalBenis()
    {
        let score = $(".item-vote .score");
        if(score.length != 0)
        {
            return $(".item-vote .score")[0].innerText;
        }
        return undefined;
    }
    static getAverageBenis()
    {
        let scoreElement = $(".item-vote .score");
        if(scoreElement.length != 0)
        {
            let score = $(".item-vote .score")[0].title;
            let divident = Number(score.substr(0,score.indexOf("u")-1));
            let divisor = Number(score.substr(score.indexOf("u")+4,score.indexOf("u")));
            if(divisor == 0)
            {
                return divident;
            }
            return divident / divisor;
        }
        else undefined; 
    }

    static getUser()
    {
        return $(".item-details .user")[0].innerText.toLowerCase();        
    }

    static getCurrentURL()
    {
        return window.location.href;
    }

    static isUserOnTop()
    {
        return window.location.href.startsWith("https://pr0gramm.com/top/");
    }

    static getUserRank(user)
    {
        let returnText;
        switch(user.classList[1])
        {
            case("um0"):
                returnText = "Schwuchtel";
            break;
            case("um1"):
                returnText = "Neuschwuchtel";
            break;
            case("um2"):
                returnText = "Altschwuchtel";
            break;
            case("um3"):
                returnText = "Administrator";
            break;
            case("um4"):
                returnText = "Gesperrt";
            break;
            case("um5"):
                returnText = "Moderator";
            break;
            case("um6"):
                returnText = "Fliesentischbesitzer";
            break;
            case("um7"):
                returnText = "Lebende Legende";
            break;
            case("um8"):
                returnText = "Wichtler";
            break;
            case("um9"):
                returnText = "Edler Spender";
            break;
            default:
                returnText = undefined;
            break;
        }
        return returnText;
    }

    getRating()
    {
        Utils.rating = $(".item-vote")[0].className;
    }

    static uniq(a) 
    {
        var seen = {};
        return a.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    }
}

Utils.pr0gramm = p;
Utils.rating;