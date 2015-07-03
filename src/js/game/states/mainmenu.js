var mainmenu = {};
mainmenu.preload = function() {
    this.game.load.spritesheet('button', 'images/button_sprite_sheet.png', 193, 71);
};
var roomid;
var roomname;
var button;

mainmenu.create = function() {
    var hash = window.location.hash.replace('#', '');
    if (!hash.length) {
        var namegroup = this.game.add.group();
        var idgroup = this.game.add.group();


        button = this.game.add.button(632, 32, 'button', start, this, 2, 1, 0);

        var style = {
            font: "24px Arial",
            fill: "#ffffff",
            align: "center"
        };

        var y = 20;
        var xmlhttp = new XMLHttpRequest();
        var url = "http://vldn.de/get.php";

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                myFunction(xmlhttp.responseText);
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();

        function myFunction(response) {
            var arr = JSON.parse(response);
            var i;

            for (i = 0; i < arr.length; i++) {
                roomid = mainmenu.game.add.text(32, y, arr[i].ID, style, idgroup);
                roomname = mainmenu.game.add.text(62, y, arr[i].User, style, namegroup);
                roomname.name = i;
                namegroup.children[i].inputEnabled = true;
                namegroup.children[i].events.onInputDown.add(open, this);
                y += 24;
            }



        }

    } else {

        this.game.state.start('game');
    }


};

function open(target) {
    var t = target;
    location.href = location.href + '#' + t.text;
    location.reload();

    console.log(t.text + 'clicked');
}

function start() {

    location.href = location.href + '#' + new Date().getTime();
    location.reload();
}
module.exports = mainmenu;
