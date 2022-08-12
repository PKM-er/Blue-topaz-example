//from https://github.com/Pamela-Wang/Obsidian-Starter-Vaults/tree/2.01/Potato%20Vault/90%20Meta/92%20Plugins/Templater%20Scripts
function getCleanTitle (msg) {
    //  no dash in title so return current title trimmed
    var count = (msg.match(/-/g) || []).length;
    var nameTitle = msg;

    if (nameTitle.length > 1){
        nameTitle = nameTitle.trim()
    }

    if (count == 0){
        // DONE send back empty string if untitled
        if (msg.includes("Untitled")){
            console.log("Untitled so returning empty space");
            return " ";
        }
        else
        {
            console.log("No Dash so returning trimmed:", msg);
            // TODO remove fullstop
            return nameTitle.trim();

        }
    }
    // if there is a dash in the title

    else if (count == 1) {
        console.log("Dash detected in:", msg);
        nameTitle = nameTitle.split("-").slice(1);
        nameTitle = nameTitle[0];
        return nameTitle.trim();


    }
    else if (count > 1){ 
        // TODO Check for date

        var dateType = /(\d{4})([-])(\d{2})([-])(\d{2})/;
        var isMatch = dateType.test(msg);

        if (isMatch && count == 2){
            // since it has a date... and only has dashes for a date, return it.
            console.log("Date detected! No other dash, return as is", msg);

            return nameTitle.trim();

        }
        else {
        // it may contain date but also a front snippet OR it does not contain date and just multiple dashes
        console.log("Just front snippets with extra dash or date but also more dash", msg);

        nameTitle = nameTitle.split("-").slice(1);
        nameTitle =  nameTitle.join('-');  
        return nameTitle.trim();
           
        }

    }
    else {
        console.log("Logic Error")
    }

}
module.exports = getCleanTitle;