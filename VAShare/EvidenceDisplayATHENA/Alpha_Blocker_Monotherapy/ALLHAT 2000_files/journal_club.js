/*
*******************************************************************************
/scripts/journal_club.js

This file contains all the Javascript used on ACP Journal Club Online, except for certain pieces which must live in the files themselves.

The sourcing line is contained in:

    /include/js_top_include.htm

which contains, among other commands, the line:

    <script language=javascript type="text/javascript" src="/scripts/journal_club.js"></script>

===============================================================================
11-02-01

This update contains the new menus: About ACP Journal Club, Contact Us, Site Map/Help, and Classifieds. The last two aren't actually menus, but they are choices on the menu bar. The menu functions are called in menu_table_include_drop_downs.htm.

11-13-01

This update contains a fix to overoutimages(). Many Annals-specific images were removed from the /images folder, but there were still calls to them in overoutimages(). These calls were commented out instead of deleted, in case it turns out we need the images later. We may, for instance, be posting PDFs and want PDF over/out images loaded. The files commented out are:

    abstract_out.gif
    abstract_over.gif
    extract_out.gif
    extract_over.gif
    nontech_sum_out.gif
    nontech_sum_over.gif
    pdf_out.gif
    pdf_over.gif

===============================================================================
12-18-01

This update contains no new functions, just additional items for the floatingnavmenu function, which draws the floating nav bar. These additions are for the Site Map page (/shared/site_map.htm). 

===============================================================================
01-4-02

Update to function tocinsert. If the index page has var

    current="1"; 

in it, CURRENT TABLE OF CONTENTS will be written in at the top, instead of TABLE OF CONTENTS, or EDITORIALS AND RESOURCE CORNER TABLE OF CONTENTS.

This update also contains an addition to the if...else section of the floater menu that inserts the date images for 2002 through 2010, not that we'll be using the same images in 2010, but I didn't want to have to think about it again during my time here. The 2002 through 2010 images are already uploaded to the live server.

*******************************************************************************
*/


// ====================== Scripts Inside Head Area ======================

var menualerts = 0; // used to turn Andrew's debugging popup windows off and on

var e;
var menuNum;
var mname;
var objname;
var id;
var xx;

/*
alert(
	"e  = " + e +
	"\nmenuNum = " + menuNum +
	"\nmname = " + mname +
	"\nobjname = " + objname +
	"\nid = " + id +
	"\nxx = " + xx
);
*/


// declare browser program and version variables

	var isNavPC;
	var isNavMac;
	var isIEMac;
	var isIEPC;
	var isNav6;

	var isLayers;
	var isDivs;
	var isOther;

	var isIEMac5;
	var isIEMac4;

//alert ("isIEMac5 = " + isIEMac5);


// Set IE4 "all" and "style" for cross-platform functionality

    var coll = "";
    var stylo = "";

// set global variables for floating menu

var x, y;
var changeY = 143;
var baseY = changeY;
var startY = changeY;
if (isIEMac5) { startY -= 127; }
var yy = 0;

/*
SET GLOBAL VARIABLES FOR POPUP MENUS

Regarding the if (window.homepage) statements below:

In the menus below, the menuY2 value tells at what vertical point the menu should be hidden. That is, how far down can the mouse go before the menu vanishes.

The menus start 16 pixels lower on the home page because of the fat blue buttons. So this if statement extends the menu space vertically. Otherwise, the menu vanishes before the mouse gets to the last menu choice. BUT, on the regular pages you don't have to go extra far down to get the menu to vanish, because the Y value is smaller.

Also, it's set so you can go several pixels past the bottom of the menu before it vanishes. The menu choices are small, and it's easy to shoot out the bottom of the menu if you're going for the last choice. This is frustrating.

POINT OF "L"

The "point of 'L' in layer" comment from the original creators of this code is a rather cryptic reference to the vertex of the lines defining the right side of the menu NAME and the top of the first menu CHOICE, shown by the asterisk in the menu diagram below, and pointed to by the dashed line.

When the mouse pointer moves outside the limits of the menu area, the menu should vanish. As the area of the menu and menu title is not a rectangle but an "L" shape, we need the x,y coordinates for the corner of the "L".

                   vertex
                     /
                    /
+----------------+ /
| MENU NAME      |/
+----------------*------------+
| JC Purpose and Procedure    |
+-----------------------------+
| Send a letter to Editor     |
+-----------------------------+
| List of Journals Reviewed   |
+-----------------------------+

*/

mName = new Array();  // name of menu
menuX1 = new Array(); // top left X of layer
menuY1 = new Array(); // top left Y of layer
menuX2 = new Array(); // bottom right X of layer
menuY2 = new Array(); // bottom right Y of layer
menuX3 = new Array(); // point of "L" in layer
menuY3 = new Array(); // point of "L" in layer


/* About ACP JC Journal Club menu */
mName[1] = "mservices"; // Name of menu.
menuX1[1] = 168;        // top left X of layer
menuY1[1] = 107;        // Top left Y of layer
menuX2[1] = 351;        // bottom right X of layer
menuY2[1] = 260;        // Bottom right Y of layer
//menuX3[1] = 277;        // point of "L" in layer
menuX3[1] = 300;        // point of "L" in layer
menuY3[1] = 128;        // point of "L" in layer

if (window.homepage)
{
    menuY1[1] = 123; //trying to fix menu non-vanishing across top
    menuY2[1] = 276;
    menuY3[1] = 143;
}

/* Contact Us menu */
mName[2] = "msiteguide";// Name of menu
menuX1[2] = 299;        // top left X of layer
menuY1[2] = 107;        // top left Y of layer
menuX2[2] = 484;        // bottom right X of layer
menuY2[2] = 278;        // Bottom right Y of layer
//menuX3[2] = 359;        // point of "L" in layer
menuX3[2] = 388;        // point of "L" in layer
menuY3[2] = 128;        // point of "L" in layer

/* Bottom right Y of layer. */
if (window.homepage)
{
    menuY1[2] = 107;
    menuY2[2] = 294;
    menuY3[2] = 143;
}

/* Unused menu. */
mName[0] = "mindex"; // name of menu
menuX1[0] = 88;      // top left X of layer
menuY1[0] = 107;     // top left Y of layer
menuX2[0] = 601;     // bottom right X of layer
menuY2[0] = 144;     // bottom right Y of layer
menuX3[0] = 601;     // point of "L" in layer
menuY3[0] = 88;      // point of "L" in layer


var mflag = false; // says page hasn't loaded yet
var mNum = -1; // says mouse is roaming, not on a menu at all

// END Set Global Variables for popup menus


function articlerollovers() {

//Sets the article bullet rollovers. By Andrew, and it might need rewriting. Works fine so far, but I (Andrew) am skeptical of Javascript.

    out=new Image;
    over=new Image;

    out.src='/images/content_bullet_out.gif';
    over.src='/images/content_bullet_over.gif';

//These are used in the Table/Figure List popup windows

    popout=new Image;
    popover=new Image;

    popout.src='/images/sidenav_arrow_out.gif';
    popover.src='/images/sidenav_arrow_over.gif';

    var highlightvalue="blue"; // this was an experiment

} // end function articlerollovers()

// ============================================================================

function setbrowser() {

// Set Booleans for DHTML

if (parseInt(navigator.appVersion) >= 4) {

	isNav6 = ((parseInt(navigator.appVersion) >= 5) && (navigator.appName == "Netscape"));
	isNavMac = ((navigator.appName == "Netscape") && (navigator.platform.indexOf("Mac") != -1) && (!isNav6));
	isNavPC = ((navigator.appName == "Netscape") && (navigator.platform.indexOf("Win") != -1) && (!isNav6));
	isIEMac = ((navigator.appName.indexOf("Microsoft") != -1) && (navigator.platform.indexOf("Mac") != -1));
	isIEPC = ((navigator.appName.indexOf("Microsoft") != -1) && (navigator.platform.indexOf("Win") != -1));

// Set Booleans for DHTML

	isLayers = ((isNavPC) || (isNavMac)); // Netscape 4, 5
	isDivs = ((isIEPC) || (isIEMac));  // IE 4, 5
	isOther = ((!isLayers) && (!isDivs)); // All Else

	isIEMac5 = ((isIEMac) && (navigator.userAgent.indexOf("5.0") != -1));
	isIEMac4 = ((isIEMac) && (!isIEMac5));

    if (isDivs) {
        coll = "all.";
        stylo = ".style";
    }
}

// Load Correct Style Sheet for Platform

	if (isNavPC) { document.write('<LINK REL="stylesheet" HREF="/css/navpc.css" TYPE="text/css">'); }

	else { document.write('<LINK REL="stylesheet" HREF="/css/notnavpc.css" TYPE="text/css">
'); } } // end function setbrowser() // function to start capturing events (onload) 
function init() { mflag = true; if (!isOther) { if (isLayers) { document.captureEvents(Event.MOUSEMOVE); 
} document.onmousemove = whereami; if (!window.homepage && !isIEMac4) { setInterval("floater()", 
200); } //no floater menu on home page. } } // End function init //qqqqq This 
one is weird. /* function initvars() { alert( "Function init() variables\n" + 
"document.onmousemove = " + document.onmousemove ) //end alert } */ // whereami 
floater to move floating menu if necessary function floater() { if (isLayers) 
{ y = self.pageYOffset; } // if (isDivs) { y = document.body.scrollTop; } if (isDivs) 
{ if (document.body.scrollTop) y = document.body.scrollTop else y=0;} if (y != 
yy) { changeY = Math.max(baseY-y,10); moveobj("floater",17,y+changeY); yy = y; 
} } // end floater function function floatalert() { alert( "function floater()\n" 
+ "yy = " + yy + "\n" + "y+changeY = " + y+changeY + "\n" + "y = " + y + "\n" 
+ "this is function floatalert()" ); } // end function floatalert() // whereami 
function to track mousemoving function whereami(e) { if (mNum == -1) { return; 
} if (isLayers) { x = e.pageX; y = e.pageY;} if (isDivs) { x = event.clientX + 
document.body.scrollLeft; y = event.clientY + document.body.scrollTop; } if ((( 
x > menuX3[mNum]) && ( y < menuY3[mNum])) || ((x < menuX1[mNum]) || (x > menuX2[mNum]) 
|| (y < menuY1[mNum]) || (y > menuY2[mNum]))) { hidez(mName[0]); hidez(mName[1]); 
hidez(mName[2]); mNum = -1; } } // End whereami function // Turn On New menu, 
turn off all others function menuOn(menuNum) { if (!mflag) return; for (i=0; i<3; 
i++) { if (i != menuNum) { hidez(mName[i]); } } showz(mName[menuNum]); } // end 
function menuOn // Show layer/div function showz(mname) { var obj = makeobj(mname); 
if (isLayers) { obj.visibility = "show"; } else if (isDivs) { obj.visibility = 
"visible"; } return false; } // End showz function // Hide layers/divs function 
hidez(mname) { /* alert (mname) */ var obj = makeobj(mname); if (isLayers) { obj.visibility 
= "hide"; } else if (isDivs) { obj.visibility = "hidden"; } if (menualerts==1) 
alert("obj.visibility = " + obj.visibility) } // End Hidez Function // General 
make object function for cross platform compatibility function makeobj(objname) 
{ var newobj; if (typeof objname == "string") { newobj = eval("document." + coll 
+ objname + stylo); } else { newobj = objname; } return newobj; } // end makeobj 
// General function to move an object to x,y function moveobj(objname,xx,yy) { 
var newobj = makeobj(objname); if (isLayers) { newobj.pageX = xx; newobj.pageY 
= yy; } else { newobj.left = xx; newobj.top = yy; } } // end movobj function // 
Global Variable Declaration for isother + over and out images function overoutimages() 
{ if (!isOther) { // Global variable var newSrc; // Over Images sitemap_OVER = 
new Image(); sitemap_OVER.src = "/images/menu_bar_map_over.gif"; classifieds_OVER 
= new Image(); classifieds_OVER.src = "/images/menu_bar_classifieds_over.gif"; 
pharm_OVER = new Image(); pharm_OVER.src = "/images/menu_sub_subscr_over.gif"; 
past_OVER = new Image(); past_OVER.src = "/images/menu_top_past_iss_over.gif"; 
search_OVER = new Image(); search_OVER.src = "/images/menu_top_search_over.gif"; 
acponline_OVER = new Image(); acponline_OVER.src = "/images/acp_asim_online_over.gif"; 
acppns_OVER = new Image(); acppns_OVER.src = "/images/acp_asim_ps_over.gif"; toc_OVER 
= new Image(); toc_OVER.src = "/images/menu_top_crnt_toc_over.gif"; cbullet_OVER 
= new Image(); cbullet_OVER.src = "/images/content_bullet_over.gif"; abullet_OVER 
= new Image(); abullet_OVER.src = "/images/menuarrow_over.gif"; lbullet_OVER = 
new Image(); lbullet_OVER.src = "/images/sidenav_arrow_over.gif"; ftbulle_OVER 
= new Image(); ftbulle_OVER.src = "/images/fulltext_over.gif"; /* exbulle_OVER 
= new Image(); exbulle_OVER.src = "/images/extract_over.gif"; */ /* pdbulle_OVER 
= new Image(); pdbulle_OVER.src = "/images/pdf_over.gif"; */ /* abbulle_OVER = 
new Image(); abbulle_OVER.src = "/images/abstract_over.gif"; */ /* ntbulle_OVER 
= new Image(); ntbulle_OVER.src = "/images/nontech_sum_over.gif"; */ subscribe_OVER 
= new Image(); subscribe_OVER.src = "/images/menu_top_subscribe_over.gif"; tbullet_OVER 
= new Image(); tbullet_OVER.src = "/images/arrow_left_over.gif"; figtablist_OVER 
= new Image(); figtablist_OVER.src = "/images/ft_list_over.gif"; fulltext_OVER 
= new Image(); fulltext_OVER.src = "/images/ft_fulltext_over.gif"; winprint_OVER 
= new Image(); winprint_OVER.src = "/images/ft_print_over.gif"; bbullet_OVER = 
new Image(); bbullet_OVER.src = "/images/content_bullet_2_over.gif"; //Home page 
buttons bigsubscribe_OVER = new Image(); bigsubscribe_OVER.src = "/images/menu_topb_subscribe_over.gif"; 
bigtoc_OVER = new Image(); bigtoc_OVER.src = "/images/menu_topb_curr_toc_over.gif"; 
bigpast_OVER= new Image(); bigpast_OVER.src = "/images/menu_topb_past_iss_over.gif"; 
bigsearch_OVER = new Image(); bigsearch_OVER.src = "/images/menu_topb_search_over.gif"; 
//end of Home page buttons // Out Images sitemap_OUT = new Image(); sitemap_OUT.src 
= "/images/menu_bar_map_out.gif"; classifieds_OUT = new Image(); classifieds_OUT.src 
= "/images/menu_bar_classifieds_out.gif"; pharm_OUT = new Image(); pharm_OUT.src 
= "/images/menu_sub_subscr_out.gif"; past_OUT = new Image(); past_OUT.src = "/images/menu_top_past_iss_out.gif"; 
search_OUT = new Image(); search_OUT.src = "/images/menu_top_search_out.gif"; 
acponline_OUT = new Image(); acponline_OUT.src = "/images/acp_asim_online_out.gif"; 
acppns_OUT = new Image(); acppns_OUT.src = "/images/acp_asim_ps_out.gif"; toc_OUT 
= new Image(); toc_OUT.src = "/images/menu_top_crnt_toc_out.gif"; cbullet_OUT 
= new Image(); cbullet_OUT.src = "/images/content_bullet_out.gif"; abullet_OUT 
= new Image(); abullet_OUT.src = "/images/menuarrow_out.gif"; lbullet_OUT = new 
Image(); lbullet_OUT.src = "/images/sidenav_arrow_out.gif"; ftbulle_OUT = new 
Image(); ftbulle_OUT.src = "/images/fulltext_out.gif"; /* exbulle_OUT = new Image(); 
exbulle_OUT.src = "/images/extract_out.gif"; */ /* pdbulle_OUT = new Image(); 
pdbulle_OUT.src = "/images/pdf_out.gif"; */ /* abbulle_OUT = new Image(); abbulle_OUT.src 
= "/images/abstract_out.gif"; */ /* ntbulle_OUT = new Image(); ntbulle_OUT.src 
= "/images/nontech_sum_out.gif"; */ subscribe_OUT = new Image(); subscribe_OUT.src 
= "/images/menu_top_subscribe_out.gif"; tbullet_OUT = new Image(); tbullet_OUT.src 
= "/images/arrow_left_out.gif"; figtablist_OUT = new Image(); figtablist_OUT.src 
= "/images/ft_list_out.gif"; fulltext_OUT = new Image(); fulltext_OUT.src = "/images/ft_fulltext_out.gif"; 
winprint_OUT = new Image(); winprint_OUT.src = "/images/ft_print_out.gif"; bbullet_OUT 
= new Image(); bbullet_OUT.src = "/images/content_bullet_2_out.gif"; //Home page 
buttons bigsubscribe_OUT = new Image(); bigsubscribe_OUT.src = "/images/menu_topb_subscribe_out.gif"; 
bigtoc_OUT = new Image(); bigtoc_OUT.src = "/images/menu_topb_curr_toc_out.gif"; 
bigpast_OUT = new Image(); bigpast_OUT.src = "/images/menu_topb_past_iss_out.gif"; 
bigsearch_OUT = new Image(); bigsearch_OUT.src = "/images/menu_topb_search_out.gif"; 
//end of Home page buttons } } // end function overoutimages() // Rollover function 
function ImageOver(id) { if (!isOther) { if (id.indexOf('bullet') != -1) { newSrc 
= id.substring(0,7); } else { newSrc = id; } document[id].src = eval(newSrc + 
'_OVER.src'); } if (menualerts==1) alert ("function ImageOver(id)\n The value 
of id is: " + id + "\n The value of newSrc is: " +newSrc + "\n The value of id.indexOf('bullet') 
is " + id.indexOf('bullet')); } // end function ImageOver(id) // Rollout function 
function ImageOut(id) { if (!isOther) { if (id.indexOf('bullet') != -1) { newSrc 
= id.substring(0,7); } else { newSrc = id; } document[id].src = eval(newSrc + 
'_OUT.src'); } } // end function ImageOut(id) // Set Netscape Redraw (Two Functions) 
function Redraw() { if (!window.saveInnerWidth) { window.onresize = resize; window.saveInnerWidth 
= window.innerWidth; window.saveInnerHeight = window.innerHeight; } } // end function 
Redraw() function resize() { if (saveInnerWidth != window.innerWidth || saveInnerHeight 
!= window.innerHeight) { window.history.go(0); } } // end function resize() // 
End Set Netscape Redraw (Two Functions) // ====================== Scripts Inside 
Body Area ====================== /* Ricki's table/figure variables will look like 
this: var tablefig="ACPJC-1998-129-2-A17T1.htm" which would mean that there was 
only a table var tablefig="ACPJC-1998-129-2-A17F1.htm" which would mean that there 
is only a figure var tablefig="ACPJC-1998-129-2-A17_FT.htm" which would mean that 
there is a list. */ function floatingnavmenu() { var completefilepath = document.URL; 
var lastslash = completefilepath.lastIndexOf("/"); var just_the_file_name = completefilepath.substring(lastslash+1); 
var floater_menu=""; var filepath = document.URL; var iscontent = filepath.indexOf("Content") 
var tablefig_floater = ""; var editorial_floater = ""; var indent_shim = ""; var 
iseditorial = ""; if (filepath.indexOf("editorials")!= -1) { iseditorial="1" } 
/* The variable editorial_floater starts life null. The statement that begins: 
if (filepath.indexOf("Content")!= -1 && filepath.indexOf("editorials")== -1) then 
stores in it code to build four floating navigation bar entries: a link to the 
home page, Editorial table of contents, Resource Corner section of the Editorial 
table of contents, and the glossary page. This is so all article and table of 
contents files will have those four links. This IF statement only runs if the 
current file lives in the /CONTENT directory. That is, it does not run on handbuilt 
pages living in the /shared directory. The variable is inserted in the statement 
that writes out the menu contents. It comes right after the floater_menu variable, 
which holds all the other navigation bar items. If the IF statement is not run, 
editorial_floater remains null and nothing is added to the menu. */ if (filepath.indexOf("Content")!= 
-1 && filepath.indexOf("editorials")== -1) { editorial_floater += '<img src="" width="93" height="9" border="0"><br>
'; editorial_floater += '<a href="/index.htm" onMouseOut="ImageOut(&#039;lbullet_101&#039;)"  onMouseOver="ImageOver(&#039;lbullet_101&#039;)"><img name="lbullet_101" src="journal_club.js" alt="Journal Club Home Page" width="15" height="9" border="0" vspace="3"></a><a href="/index.htm" onMouseOut="ImageOut(&#039;lbullet_101&#039;)" onMouseOver="ImageOver(&#039;lbullet_101&#039;)"><img src="" alt="Journal Club Home Page" width="26" height="9" border="0" vspace="3"></a><br>
'; editorial_floater += '<a href="/Content/editorials/index.htm" onMouseOut="ImageOut(&#039;lbullet_98&#039;)"  onMouseOver="ImageOver(&#039;lbullet_98&#039;)"><img name="lbullet_98" src="journal_club.js" alt="Editorials" width="15" height="9" border="0" vspace="3"></a><a href="/Content/editorials/index.htm" onMouseOut="ImageOut(&#039;lbullet_98&#039;)" onMouseOver="ImageOver(&#039;lbullet_98&#039;)"><img src="" alt="Editorials" width="44" height="9" border="0" vspace="3"></a><br>
'; editorial_floater += '<a href="/Content/editorials/index.htm#reso" onMouseOut="ImageOut(&#039;lbullet_99&#039;)"  onMouseOver="ImageOver(&#039;lbullet_99&#039;)"><img name="lbullet_99" src="journal_club.js" alt="Resource Corner" width="15" height="9" border="0" vspace="3"></a><a href="/Content/editorials/index.htm#reso" onMouseOut="ImageOut(&#039;lbullet_99&#039;)" onMouseOver="ImageOver(&#039;lbullet_99&#039;)"><img src="/images/menu_flt_hand_rescorner.gif" alt="Resource Corner" width="78" height="9" border="0" vspace="3"></a><br>
'; editorial_floater += '<a href="/shared/glossary.htm" onMouseOut="ImageOut(&#039;lbullet_100&#039;)"  onMouseOver="ImageOver(&#039;lbullet_100&#039;)"><img name="lbullet_100" src="journal_club.js" alt="Glossary" width="15" height="9" border="0" vspace="3"></a><a href="/shared/glossary.htm" onMouseOut="ImageOut(&#039;lbullet_100&#039;)" onMouseOver="ImageOver(&#039;lbullet_100&#039;)"><img src="/images/menu_flt_hand_glossary.gif" alt="Glossary" width="41" height="9" border="0" vspace="3"></a><br>
'; } //end if (filepath.indexOf("CONTENT")!= -1) /* The variable tablefig_floater 
starts life null. If the variable tablefig is non-null, the "Tables/Figures List" 
graphic is inserted and linked to the tables/figures list HTML file. The tablefig_floater 
variable is in the statement that writes out the menu contents. It comes right 
after the floater_menu variable, and before the bariable that holds the editorial/resource 
corner links. */ //alert("window.tablefig = " + window.tablefig); if (window.tablefig 
&& tablefig!="") { //tablefig_floater += '<a href="#" onClick=tablefigpop(\'ACPJC-1991-115-2-A16F1.htm\',0)> 
<img src="journal_club.js" alt="Figures/Tables List" width="15" height="9" border="0" vspace="3"></a><br>
'; tablefig_floater += '<a href="#" onClick=tablefigpop(\'' + tablefig + '\',0)  onMouseOut="ImageOut(&#039;lbullet_999&#039;)"  onMouseOver="ImageOver(&#039;lbullet_999&#039;)"><img name="lbullet_999" src="journal_club.js" alt="Figures/Tables List" width="15" height="9" border="0" vspace="3"></a><a href="#" onClick=tablefigpop(\'' + tablefig + '\',0) onMouseOut="ImageOut(&#039;lbullet_999&#039;)" onMouseOver="ImageOver(&#039;lbullet_999&#039;)"><img src="/images/menu_flt_figs_tables.gif" alt="Figures/Tables List" width="95" height="9" border="0" vspace="3"></a><br>
'; } //end if (tablefig!=-1) /* The length of the floatitems array is 4. Count 
begins at 1 and goes while the counter is less than floatitems.length, which is 
4. So it only loops 3 times. So it has to go until it hits floatitems.length+1. 
This is because the count is starting at 1, while the array starts at 0. I would 
have started the counter at 0, except I was using it to identify the lbullet_1, 
lbullet_2, lbullet_3, and so on. */ for (count = 1 ; count<floatitems.length+1 ; count++)
{

/*
    alert(
    "Count = " + count +
    "\n\nThe floatitems array has " + floatitems.length + " items\n\n" +
    "The anchor text: floatitems[count-1].substring(0,4) = " + floatitems[count-1].substring(0,4) +
     "\n\nThe full float item variable: floatitems[count-1] = " + floatitems[count-1]
    );
*/

menu_graphic = ""
menu_graphic_width = ""

    if (floatitems[count-1] == "Therapeutics")
    {
        menu_graphic = "menu_flt_toc_ther_pagetop.gif";
        menu_graphic_width = "112";
        floatitems[count-1] = "Start"
    }

/*
    Note that the above if statement differs from the rest below. The floatitems array item is redefined to "Start." Without this redefinition, the Therapeutics menu option would link to >a 
name="Ther"></a>. But we want Therapeutics to go to the top of the page, not just 
to the top of the list of articles. And the target it links to is the first four 
characters of the floatitems item. So floatitems==Therapeutics gets the proper 
graphic defined, and redefining the floatitems item to "Start" gets the proper 
bookmark written. --Andrew. P.S. I'm sorry this is so inarticulate. */ else if 
(floatitems[count-1] == "Diagnosis") { menu_graphic = "menu_flt_toc_diag.gif"; 
menu_graphic_width = "40"; indent_shim = ""; } else if (floatitems[count-1] == 
"Etiology") { menu_graphic = "menu_flt_toc_etio.gif"; menu_graphic_width = "35"; 
indent_shim = ""; } else if (floatitems[count-1] == "Resource Corner") { menu_graphic 
= "menu_flt_toc_reso.gif"; menu_graphic_width = "75"; indent_shim = ""; } else 
if (floatitems[count-1] == "Start") { menu_graphic = "menu_flt_art_start.gif"; 
menu_graphic_width = "40"; indent_shim = ""; } else if (floatitems[count-1] == 
"Commentary") { menu_graphic = "menu_flt_art_commentary.gif"; menu_graphic_width 
= "55"; indent_shim = ""; } else if (floatitems[count-1] == "References") { menu_graphic 
= "menu_flt_art_references.gif"; menu_graphic_width = "50"; indent_shim = ""; 
} else if (floatitems[count-1] == "Table") { menu_graphic = "menu_flt_art_table.gif"; 
menu_graphic_width = "23"; indent_shim = ""; } else if (floatitems[count-1] == 
"Clinical Prediction Guide") { menu_graphic = "menu_flt_toc_clinpred.gif"; menu_graphic_width 
= "102"; indent_shim = ""; } else if (floatitems[count-1] == "Differential Diagnosis") 
{ menu_graphic = "menu_flt_toc_diffdiag.gif"; menu_graphic_width = "92"; indent_shim 
= ""; } else if (floatitems[count-1] == "Economics") { menu_graphic = "menu_flt_toc_econ.gif"; 
menu_graphic_width = "46"; indent_shim = ""; } else if (floatitems[count-1] == 
"Health Economics") { menu_graphic = "menu_flt_toc_healecon.gif"; menu_graphic_width 
= "76"; indent_shim = ""; } else if (floatitems[count-1] == "Letter") { menu_graphic 
= "menu_flt_toc_lett.gif"; menu_graphic_width = "25"; indent_shim = ""; } else 
if (floatitems[count-1] == "Letters") { menu_graphic = "menu_flt_toc_letts.gif"; 
menu_graphic_width = "30"; indent_shim = ""; } else if (floatitems[count-1] == 
"Prognosis") { menu_graphic = "menu_flt_toc_prog.gif"; menu_graphic_width = "42"; 
indent_shim = ""; } else if (floatitems[count-1] == "Quality Assurance") { menu_graphic 
= "menu_flt_toc_qualassu.gif"; menu_graphic_width = "78"; indent_shim = ""; } 
else if (floatitems[count-1] == "Quality Improvement") { menu_graphic = "menu_flt_toc_qualimpr.gif"; 
menu_graphic_width = "90"; indent_shim = ""; } else if (floatitems[count-1] == 
"using") { menu_graphic = "menu_flt_hand_using.gif"; menu_graphic_width = "85"; 
indent_shim = ""; } else if (floatitems[count-1] == "searching") { menu_graphic 
= "menu_flt_hand_searching.gif"; menu_graphic_width = "41"; indent_shim = ""; 
} else if (floatitems[count-1] == "access") { menu_graphic = "menu_flt_hand_access.gif"; 
menu_graphic_width = "101"; indent_shim = ""; } else if (floatitems[count-1] == 
"therapeuticshand") { menu_graphic = "menu_flt_hand_ther.gif"; menu_graphic_width 
= "55"; indent_shim = ""; } else if (floatitems[count-1] == "diagnosishand") { 
menu_graphic = "menu_flt_hand_diag.gif"; menu_graphic_width = "40"; indent_shim 
= ""; } else if (floatitems[count-1] == "etiologyhand") { menu_graphic = "menu_flt_hand_etiology.gif"; 
menu_graphic_width = "35"; indent_shim = ""; } else if (floatitems[count-1] == 
"computersearchhand") { menu_graphic = "menu_flt_hand_compsrch.gif"; menu_graphic_width 
= "73"; indent_shim = ""; } else if (floatitems[count-1] == "A-C") { menu_graphic 
= "menu_flt_hand_a2c.gif"; menu_graphic_width = "17"; indent_shim = ""; } else 
if (floatitems[count-1] == "E-L") { menu_graphic = "menu_flt_hand_e2l.gif"; menu_graphic_width 
= "17"; indent_shim = ""; } else if (floatitems[count-1] == "P-Z") { menu_graphic 
= "menu_flt_hand_p2z.gif"; menu_graphic_width = "17"; indent_shim = ""; } else 
if (floatitems[count-1] == "2010") { menu_graphic = "menu_flt_hand_2010.gif"; 
menu_graphic_width = "20"; indent_shim = ""; } else if (floatitems[count-1] == 
"2009") { menu_graphic = "menu_flt_hand_2009.gif"; menu_graphic_width = "20"; 
indent_shim = ""; } else if (floatitems[count-1] == "2008") { menu_graphic = "menu_flt_hand_2008.gif"; 
menu_graphic_width = "20"; indent_shim = ""; } else if (floatitems[count-1] == 
"2007") { menu_graphic = "menu_flt_hand_2007.gif"; menu_graphic_width = "20"; 
indent_shim = ""; } else if (floatitems[count-1] == "2006") { menu_graphic = "menu_flt_hand_2006.gif"; 
menu_graphic_width = "20"; indent_shim = ""; } else if (floatitems[count-1] == 
"2005") { menu_graphic = "menu_flt_hand_2005.gif"; menu_graphic_width = "20"; 
indent_shim = ""; } else if (floatitems[count-1] == "2004") { menu_graphic = "menu_flt_hand_2004.gif"; 
menu_graphic_width = "20"; indent_shim = ""; } else if (floatitems[count-1] == 
"2003") { menu_graphic = "menu_flt_hand_2003.gif"; menu_graphic_width = "20"; 
indent_shim = ""; } else if (floatitems[count-1] == "2002") { menu_graphic = "menu_flt_hand_2002.gif"; 
menu_graphic_width = "20"; indent_shim = ""; } else if (floatitems[count-1] == 
"2001") { menu_graphic = "menu_flt_hand_2001.gif"; menu_graphic_width = "20"; 
indent_shim = ""; } else if (floatitems[count-1] == "2000") { menu_graphic = "menu_flt_hand_2000.gif"; 
menu_graphic_width = "20"; indent_shim = ""; } else if (floatitems[count-1] == 
"1999") { menu_graphic = "menu_flt_hand_1999.gif"; menu_graphic_width = "20"; 
indent_shim = ""; } else if (floatitems[count-1] == "1998") { menu_graphic = "menu_flt_hand_1998.gif"; 
menu_graphic_width = "20"; indent_shim = ""; } else if (floatitems[count-1] == 
"1997") { menu_graphic = "menu_flt_hand_1997.gif"; menu_graphic_width = "20"; 
indent_shim = ""; } else if (floatitems[count-1] == "1996") { menu_graphic = "menu_flt_hand_1996.gif"; 
menu_graphic_width = "20"; indent_shim = ""; } else if (floatitems[count-1] == 
"1995") { menu_graphic = "menu_flt_hand_1995.gif"; menu_graphic_width = "20"; 
indent_shim = ""; } else if (floatitems[count-1] == "1994") { menu_graphic = "menu_flt_hand_1994.gif"; 
menu_graphic_width = "20"; indent_shim = ""; } else if (floatitems[count-1] == 
"1993") { menu_graphic = "menu_flt_hand_1993.gif"; menu_graphic_width = "20"; 
indent_shim = ""; } else if (floatitems[count-1] == "1992") { menu_graphic = "menu_flt_hand_1992.gif"; 
menu_graphic_width = "20"; indent_shim = ""; } else if (floatitems[count-1] == 
"1991") { menu_graphic = "menu_flt_hand_1991.gif"; menu_graphic_width = "20"; 
indent_shim = ""; } else if (floatitems[count-1] == "Editorial") { menu_graphic 
= "menu_flt_toc_editorials.gif"; menu_graphic_width = "44"; indent_shim = ""; 
} /* ----------------------------------------------------- */ else if (floatitems[count-1] 
== "lted") { menu_graphic = "menu_flt_latest_editorial.gif"; menu_graphic_width 
= "115"; indent_shim = ""; } else if (floatitems[count-1] == "ltrc") { menu_graphic 
= "menu_flt_latest_resource_corners.gif"; menu_graphic_width = "115"; indent_shim 
= ""; } else if (floatitems[count-1] == "pteditorials") { menu_graphic = "menu_flt_past_editorials.gif"; 
menu_graphic_width = "69"; indent_shim = ""; } else if (floatitems[count-1] == 
"ptrcorner") { menu_graphic = "menu_flt_past_resource_corners.gif"; menu_graphic_width 
= "108"; indent_shim = ""; } /* Editorial Floater Past Editorials Subheads */ 
else if (floatitems[count-1] == "lteditorials") { menu_graphic = "menu_flt_latest_editorial.gif"; 
menu_graphic_width = "115"; indent_shim = ""; } else if (floatitems[count-1] == 
"ltresourcecorner") { menu_graphic = "menu_flt_latest_rescorner.gif"; menu_graphic_width 
= "102"; indent_shim = ""; } else if (floatitems[count-1] == "jcabout") { menu_graphic 
= "menu_flt_aboutacpjc.gif"; menu_graphic_width = "104"; indent_shim = "<img src=\"/images/float_indent_shim.gif\">"; 
} else if (floatitems[count-1] == "ebmabout") { menu_graphic = "menu_flt_nature.gif"; 
menu_graphic_width = "103"; indent_shim = "<img src=\"/images/float_indent_shim.gif\">"; 
} else if (floatitems[count-1] == "resabout") { menu_graphic = "menu_flt_research_methods.gif"; 
menu_graphic_width = "80"; indent_shim = "<img src=\"/images/float_indent_shim.gif\">"; 
} else if (floatitems[count-1] == "anaabout") { menu_graphic = "menu_flt_analysis.gif"; 
menu_graphic_width = "98"; indent_shim = "<img src=\"/images/float_indent_shim.gif\">"; 
} else if (floatitems[count-1] == "traabout") { menu_graphic = "menu_flt_transfer.gif"; 
menu_graphic_width = "92"; indent_shim = "<img src=\"/images/float_indent_shim.gif\">"; 
} else if (floatitems[count-1] == "eduabout") { menu_graphic = "menu_flt_education.gif"; 
menu_graphic_width = "91"; indent_shim = "<img src=\"/images/float_indent_shim.gif\">"; 
} else if (floatitems[count-1] == "eviabout") { menu_graphic = "menu_flt_inforesources.gif"; 
menu_graphic_width = "97"; indent_shim = "<img src=\"/images/float_indent_shim.gif\">"; 
} else if (floatitems[count-1] == "decabout") { menu_graphic = "menu_flt_decision.gif"; 
menu_graphic_width = "69"; indent_shim = "<img src=\"/images/float_indent_shim.gif\">"; 
} else if (floatitems[count-1] == "past_resource_corner") { menu_graphic = "menu_flt_past_rescorners.gif"; 
menu_graphic_width = "98"; indent_shim = ""; } /* End Editorial Floater Past Editorials 
Subheads */ /* Float Items Specifically for /shared/site_map.htm */ else if (floatitems[count-1] 
== "smpt") { menu_graphic = "menu_flt_sitemap-top.gif"; menu_graphic_width = "92"; 
indent_shim = ""; } else if (floatitems[count-1] == "directlinks") { menu_graphic 
= "menu_flt_directlinks.gif"; menu_graphic_width = "56"; indent_shim = "<img src=\"/images/float_indent_shim.gif\">"; 
} else if (floatitems[count-1] == "jcabout") { menu_graphic = "menu_flt_aboutacpjc.gif"; 
menu_graphic_width = "104"; indent_shim = "<img src=\"/images/float_indent_shim.gif\">"; 
} else if (floatitems[count-1] == "reachus") { menu_graphic = "menu_flt_reachus.gif"; 
menu_graphic_width = "50"; indent_shim = "<img src=\"/images/float_indent_shim.gif\">"; 
} else if (floatitems[count-1] == "help") { menu_graphic = "menu_flt_help.gif"; 
menu_graphic_width = "21"; indent_shim = ""; } else if (floatitems[count-1] == 
"tech") { menu_graphic = "menu_flt_technical.gif"; menu_graphic_width = "43"; 
indent_shim = "<img src=\"/images/float_indent_shim.gif\">"; } else if (floatitems[count-1] 
== "content") { menu_graphic = "menu_flt_edit-cont.gif"; menu_graphic_width = 
"78"; indent_shim = "<img src=\"/images/float_indent_shim.gif\">"; } else if (floatitems[count-1] 
== "acce") { menu_graphic = "menu_flt_subs-adv.gif"; menu_graphic_width = "90"; 
indent_shim = "<img src=\"/images/float_indent_shim.gif\">"; } /* END Float Items 
Specifically for /shared/site_map.htm */ /* else if (floatitems[count-1] == "xxxxxxxxxxxxxxx") 
{ menu_graphic = "menu_flt_figs_tables.gif"; menu_graphic_width = "95"; indent_shim 
= ""; } else if (floatitems[count-1] == "xxxxxxxxxxxxx") { menu_graphic = "menu_flt_fig.gif"; 
menu_graphic_width = "30"; indent_shim = ""; } else if (floatitems[count-1] == 
"xxxxxxxxxxxxx") { menu_graphic = "menu_flt_table.gif"; menu_graphic_width = "26"; 
indent_shim = ""; } */ /* If a floatitem does not match any of the conditionals 
above, then nothing should happen or be done to the floater menu. The if test 
below only appends the floater_menu variable if one of my defined image names 
and widths matches one of Thom's floatitems[n] in the source file. */ if (menu_graphic!="" 
&& menu_graphic_width!="") { /* if (just_the_file_name!="INDEX.HTM" && just_the_file_name!="index.htm" 
&& just_the_file_name!="index.htm#Reso") { floater_menu += '<a href="#' + floatitems[count-1].substring(0,4).toLowerCase() + '" onMouseOut="ImageOut(&#039;lbullet_' + count + '&#039;)" onMouseOver="ImageOver(&#039;lbullet_' + count + '&#039;)"><img name="lbullet_' + count + '" src="journal_club.js" alt="' + floatitems[count-1] + '" width="15" height="9" border="0" vspace="3"></a><a href="#' + floatitems[count-1].substring(0,4).toLowerCase() + '" onMouseOut="ImageOut(&#039;lbullet_' + count + '&#039;)" onMouseOver="ImageOver(&#039;lbullet_' + count + '&#039;)"><img src="/images/' + menu_graphic + '" alt="' + floatitems[count-1] + '" width="' + menu_graphic_width + '" height="9" border="0" vspace="3"></a><br>
'; } else { */ /* FLOATER MENU FILLER BEFORE THE INDENT_SHIM INSERTS WERE ADDED 
floater_menu += '<a href="#' + floatitems[count-1].substring(0,4) + '" onMouseOut="ImageOut(&#039;lbullet_' + count + '&#039;)" onMouseOver="ImageOver(&#039;lbullet_' + count + '&#039;)"><img name="lbullet_' + count + '" src="journal_club.js" alt="' + floatitems[count-1] + '" width="15" height="9" border="0" vspace="3"></a><a href="#' + floatitems[count-1].substring(0,4) + '" onMouseOut="ImageOut(&#039;lbullet_' + count + '&#039;)" onMouseOver="ImageOver(&#039;lbullet_' + count + '&#039;)"><img src="/images/' + menu_graphic + '" alt="' + floatitems[count-1] + '" width="' + menu_graphic_width + '" height="9" border="0" vspace="3"></a><br>
'; */ floater_menu += indent_shim + '<a href="#' + floatitems[count-1].substring(0,4) + '" onMouseOut="ImageOut(&#039;lbullet_' + count + '&#039;)" onMouseOver="ImageOver(&#039;lbullet_' + count + '&#039;)"><img name="lbullet_' + count + '" src="journal_club.js" alt="' + floatitems[count-1] + '" width="15" height="9" border="0" vspace="3"></a><a href="#' + floatitems[count-1].substring(0,4) + '" onMouseOut="ImageOut(&#039;lbullet_' + count + '&#039;)" onMouseOver="ImageOver(&#039;lbullet_' + count + '&#039;)"><img src="/images/' + menu_graphic + '" alt="' + floatitems[count-1] + '" width="' + menu_graphic_width + '" height="9" border="0" vspace="3"></a><br>
';

//        }

        } // end if (menu_graphic!="" && menu_graphic_width!="")

} //end for (count = 1 ; count<floatitems.length+1 ; count++)

    if (isLayers) { document.write('>layer name="floater" left=17 top=143 z-index=15 visibility="visible">' + floater_menu + tablefig_floater + editorial_floater + '</layer>'); } else if (isDivs && !isIEMac4) { document.write('<div id="floater" style="position:absolute; left:17; top:143; z-index:15; visibility:visible">' + floater_menu + tablefig_floater + editorial_floater + '</div>'); } else { document.write(floater_menu); }

    /*
    Below is the old if() statement that wrote out the floating nav bar, before I added the Editorials and Resource Corner links.

    if (isLayers) { document.write('<layer name="floater" left=17 top=143 z-index=15 visibility="visible">' + floater_menu + '</layer>'); 	} else if (isDivs && !isIEMac4) { document.write('<div id="floater" style="position:absolute; left:17; top:143; z-index:15; visibility:visible">' + floater_menu + '</div>'); 	} else { document.write(floater_menu); }
    */

} //end function floatingnavmenu()

// ============================================================================

function servicesmenu() //About ACP Journal Club Menu

{

if (!isOther) {

	var services_menu = '';

	services_menu += '<img src="/images/menu_bar_about_acp_over.gif" width="132" height="21" border="0" alt="About ACP Journal Club" hspace="12">';

	services_menu += '<table cellpadding=0 cellspacing=0 border=0 width=206><tr>';

	services_menu += '<td width=12 bgcolor="#ffffff"><img src="/images/shim.gif" alt="" width="12" height="1" hspace="0" vspace="0" border="0"></td>';

	services_menu += '<td width=182><img src="/images/dot_153255226.gif" width=182 height=1 alt="" border="0"><br>';

	services_menu += '<a href="/shared/purpose_and_procedure.htm" onMouseOut="ImageOut(&#039;abullet_15&#039;);"  onMouseOver="ImageOver(&#039;abullet_15&#039;);"><img name="abullet_15" src="/images/menuarrow_out.gif" width="14" height="18" border="0" alt=""><img src="/images/menu_sub_purpose.gif" width="168" height="18" border="0" alt="Purpose and Procedure"></a><br>';

	services_menu += '<a href="/shared/editorial_policy.htm" onMouseOut="ImageOut(&#039;abullet_12&#039;);"  onMouseOver="ImageOver(&#039;abullet_12&#039;);"><img name="abullet_12" src="/images/menuarrow_out.gif" width="14" height="18" border="0" alt=""><img src="/images/menu_sub_copyright.gif" width="168" height="18" border="0" alt="Copyrights and Disclaimers"></a><br>';

	services_menu += '<a href="/shared/journals_reviewed.htm" onMouseOut="ImageOut(&#039;abullet_17&#039;);"  onMouseOver="ImageOver(&#039;abullet_17&#039;);"><img name="abullet_17" src="/images/menuarrow_out.gif" width="14" height="18" border="0" alt=""><img src="/images/menu_sub_list_of_journals.gif" width="168" height="18" border="0" alt="List of Journals Reviewed"></a><br>';

	services_menu += '<a href="/shared/notices_and_corrections.htm" onMouseOut="ImageOut(&#039;abullet_16&#039;);"  onMouseOver="ImageOver(&#039;abullet_16&#039;);"><img name="abullet_16" src="/images/menuarrow_out.gif" width="14" height="18" border="0" alt=""><img src="/images/menu_sub_notices.gif" width="168" height="18" border="0" alt="Notices and Corrections"></a><br>';

	services_menu += '<a href="/shared/how_to_cite.htm" onMouseOut="ImageOut(&#039;abullet_18&#039;);"  onMouseOver="ImageOver(&#039;abullet_18&#039;);"><img name="abullet_18" src="/images/menuarrow_out.gif" width="14" height="18" border="0" alt=""><img src="/images/menu_sub_cite.gif" width="168" height="18" border="0" alt="How to Cite ACP Journal Club"></a>';

	services_menu += '<a href="/shared/editorial_staff.htm" onMouseOut="ImageOut(&#039;abullet_19&#039;);"  onMouseOver="ImageOver(&#039;abullet_19&#039;);"><img name="abullet_19" src="/images/menuarrow_out.gif" width="14" height="18" border="0" alt=""><img src="/images/menu_sub_editorial_publish.gif" width="168" height="18" border="0" alt="Editorial and Publishing Staff"></a>';

    services_menu += '<a href="/shared/technical_staff.htm" onMouseOut="ImageOut(&#039;abullet_20&#039;);"  onMouseOver="ImageOver(&#039;abullet_20&#039;);"><img name="abullet_20" src="/images/menuarrow_out.gif" width="14" height="18" border="0" alt=""><img src="/images/menu_sub_staff.gif" width="168" height="18" border="0" alt="Web Site Technical Staff"></a></td>';

    services_menu += '<td width=12 bgcolor="#ffffff"><img src="/images/shim.gif" alt="" width="12" height="1" hspace="0" vspace="0" border="0"></td></tr>';

	services_menu += '<tr><td colspan=3 width=203 height=15 bgcolor="#ffffff"><img src="/images/shim.gif" alt="" width="1" height="15" hspace="0" vspace="0" border="0"></td></tr></table>';

    if (window.homepage)
    {
        services_menu_top="121";
    }

    else
    {
        services_menu_top="105";
    }

    if (isLayers) { document.write('<layer name="mservices" left=156 top=' + services_menu_top +  'z-index=15 visibility="hidden">' + services_menu + '</layer>'); } else if (isDivs) { document.write('<div id="mservices" style="position:absolute; left:156px; top:' + services_menu_top + 'px; z-index:15; visibility:hidden">' + services_menu + '</div>'); }

    //if (isLayers) { document.write('<layer name="mservices" left=156 top=105 z-index=15 visibility="hidden">' + services_menu + '</layer>'); } else if (isDivs) { document.write('<div id="mservices" style="position:absolute; left:156px; top:105px; z-index:15; visibility:hidden">' + services_menu + '</div>'); }

}

} //end function servicesmenu()

// ============================================================================

function siteguidemenu() //Contact Us Menu

{

if (!isOther) {

	var siteguide_menu = '';

	siteguide_menu += '<img src="/images/menu_bar_contact_over.gif" width="87" height="21" border="0" alt="Contact Us" hspace="12" name="contactus">';

    siteguide_menu += '<table border="0" cellspacing="0" cellpadding="0" width="209"><tr><td width=12 bgcolor="#ffffff"><img src="/images/shim.gif" alt="" width="12" height="1" hspace="0" vspace="0" border="0"></td>';

	siteguide_menu += '<td align="left" bgcolor="#FFFFFF" width=200><img src="/images/dot_153255226.gif" width=175 height=1 alt="" border="0"><br>';

    siteguide_menu += '<a href="mailto:bhaynes@mcmaster.ca" onMouseOut="ImageOut(&#039;abullet_21&#039;);" onMouseOver="ImageOver(&#039;abullet_21&#039;);"><img name="abullet_21" src="/images/menuarrow_out.gif" width="14" height="18" border="0" alt=""><img src="/images/menu_sub_letter_editor.gif" width="168" height="18" border="0" alt="Send Letter to Editor"></a><br>';

	siteguide_menu += '<a href="/shared/commentator.htm" onMouseOut="ImageOut(&#039;abullet_22&#039;);" onMouseOver="ImageOver(&#039;abullet_22&#039;);"><img name="abullet_22" src="/images/menuarrow_out.gif" width="14" height="18" border="0" alt=""><img src="/images/menu_sub_commentator.gif" width="168" height="18" border="0" alt="Become a Commentator"></a><br>';

	siteguide_menu += '<a href="http://www.acponline.org/catalog/journals/subs.html" onMouseOut="ImageOut(&#039;abullet_23&#039;);" onMouseOver="ImageOver(&#039;abullet_23&#039;);"><img name="abullet_23" src="/images/menuarrow_out.gif" width="14" height="18" border="0" alt=""><img src="/images/menu_sub_subscribe.gif" width="168" height="18" border="0" alt="Subscribe to ACP Journal Club"></a><br>';

	siteguide_menu += '<a href="/shared/reprints.html" onMouseOut="ImageOut(&#039;abullet_25&#039;);" onMouseOver="ImageOver(&#039;abullet_25&#039;);"><img name="abullet_25" src="/images/menuarrow_out.gif" width="14" height="18" border="0" alt=""><img src="/images/menu_sub_bulk_reprints.gif" width="168" height="18" border="0" alt="Order Bulk Reprints"></a><br>';

    siteguide_menu += '<a href="/shared/reproduce.html" onMouseOut="ImageOut(&#039;abullet_26&#039;);" onMouseOver="ImageOver(&#039;abullet_26&#039;);"><img name="abullet_26" src="/images/menuarrow_out.gif" width="14" height="18" border="0" alt=""><img src="/images/menu_sub_repro_content.gif" width="168" height="18" border="0" alt="Reproduce/Republish Content"></a><br>';

    siteguide_menu += '<a href="http://www.acponline.org/journals/advert/index.html" onMouseOut="ImageOut(&#039;abullet_27&#039;);" onMouseOver="ImageOver(&#039;abullet_27&#039;);"><img name="abullet_27" src="/images/menuarrow_out.gif" width="14" height="18" border="0" alt=""><img src="/images/menu_sub_prod_ad.gif" width="168" height="18" border="0" alt="Product Advertising"></a><br>';

    siteguide_menu += '<a href="http://www.acponline.org/careers/recruit/" onMouseOut="ImageOut(&#039;abullet_28&#039;);" onMouseOver="ImageOver(&#039;abullet_28&#039;);"><img name="abullet_28" src="/images/menuarrow_out.gif" width="14" height="18" border="0" alt=""><img src="/images/menu_sub_recruit_ad.gif" width="168" height="18" border="0" alt="Recruitment Advertising"></a><br>';

    siteguide_menu += '<a href="/shared/other_services.htm" onMouseOut="ImageOut(&#039;abullet_29&#039;);" onMouseOver="ImageOver(&#039;abullet_29&#039;);"><img name="abullet_29" src="/images/menuarrow_out.gif" width="14" height="18" border="0" alt=""><img src="/images/menu_sub_other.gif" width="168" height="18" border="0" alt="Other Services"></a><br>';

	siteguide_menu += '</td><td width=12 bgcolor="#ffffff"><img src="/images/shim.gif" alt="" width="12" height="1" hspace="0" vspace="0" border="0"></td></tr>';

	siteguide_menu += '<tr><td colspan=3 width=176 height=15 bgcolor="#ffffff"><img src="/images/shim.gif" alt="" width="1" height="15" hspace="0" vspace="0" border="0"></td></tr></table>';

    if (window.homepage && homepage==1)
    {
        siteguidemenu_top="121";
    }

    else
    {
        siteguidemenu_top="105";
    }


	if (isLayers) { document.write('<layer name="msiteguide" left=288 top=' + siteguidemenu_top + ' z-index=15 visibility="hidden">' + siteguide_menu + '</layer>');
	} else if (isDivs) { document.write('<div id="msiteguide" style="position:absolute; left:288px; top:' + siteguidemenu_top +'px; z-index:15; visibility:hidden">' + siteguide_menu + '</div>'); }

}

} //end function siteguidemenu()

// ============================================================================

function indexmenu() //Not Used

{

if (!isOther) {

	var index_menu = '';

    index_menu += '<img src="/images/menu_top_subscribe_over.gif" width=144 height=17 border=0 alt="Index" hspace=12>';

	index_menu += '<table cellpadding=0 cellspacing=0 border=0 width=168><tr><td width=12 bgcolor="#ffffff"><img src="/images/dot_255255255.gif" alt="" width=12 height=1 border=0></td>';

	index_menu += '<td width=156><img src="/images/dot_153255226.gif" width=144 height=1 alt="" border="0"><br>';

	index_menu += '<a href="/ai/ai.html" onMouseOut="ImageOut(&#039;abullet_1&#039;);"  onMouseOver="ImageOver(&#039;abullet_1&#039;)"><img name="abullet_1" src="/images/menuarrow_out.gif" width="14" height="18" border="0" alt=""><img src="/images/menu_top_auth_index.gif" width="130" height="18" border="0" alt="Author Index"></a></td></tr>';

	index_menu += '<tr><td colspan=2 bgcolor="#ffffff" width=168 height=15><img src="/images/dot_255255255.gif" alt="" width=1 height=15 border=0></td></tr></table>';

    if (isLayers) { document.write('<layer name="mindex" left=444 top=88 z-index=15 visibility="hidden">' + index_menu + '</layer>');
	} else if (isDivs) { document.write('<div id="mindex" style="position:absolute; left:444px; top:88px; z-index:15; visibility:hidden">' + index_menu + '</div>'); }
}
} //end function indexmenu()


// ============================================================================

/*
Function prevnext() is called in menu_table_include.htm. It first checks to see if the homepage variable exists. If it does, then it writes a gif to make the table cell the proper width so the menus line up properly, and the inserts the dateline variable. The home page is the only page which has the dateline where the prev/next buttons usually are.

Next it checks to see if the variable prev has a value assigned to it. If it doesn't, it inserts the graphic prevnext_none.gif which is the exact size of prev_on.gif, item_issue.gif, and next_on.gif put together. It is a blank white graphic and just keeps the pull-down menus properly spaced. Without it, they would be at the hard left of the page, and that doesn't work.

If the variable prev does have a value, the function prevnext2() is called.
*/

function prevnext() {

        if (window.homepage && homepage==1)
        {
            document.write("<img src=\"/images/homepage_datecell_spacer.gif\" width=\"156\" height=\"1\" border=\"0\" alt=\"\"><br><font size=\"1\" color=\"#00000\" face=\"arial, sans-serif\" class=\"homepagedateline\">" + dateline + "</font>");
        }

        else if (prev=="")
        document.write("<img src=\"/images/prevnext_none.gif\" alt=\"\" width=\"156\" height=\"21\" border=\"0\">");

        else {
        prevnext2();
        }

} //end function prevnext


function prevnext2() {

/*
Written on Thursday, March 29, 2001, by Andrew Langman
Updated Monday, May 14, 2001, by Andrew Langman
Updated Monday, May 16, 2001, by Andrew Langman

The prevnext2() function is called by function prevnext(), which is in menu_table_include.htm. The function inserts the previous and next buttons at the top left of the page, and inserts either the Issue or the Article graphic between the two buttons.

The variables "next" and "prev" live in each individual html file. Thom Kuhn's XSL translation creates them, and they are structured as filename.htm. Note that if "next" or "prev" equal "0.htm", then a "greyed out" next or previous image is inserted, and there is no link.

The Issue graphic is inserted if the filename is "index.html," which indicates a table of contents page. If the filename is anything other than "index.html," the Article graphic is inserted.

-------------------------------------------------------------------------------
Old Notes

The three variable statements:

    var completefilepath = document.URL inserts the full path, domain and all, in the variable completefilepath.

    var lastslash = completefilepath.lastIndexOf("/") uses the lastIndexOf function to find the last occurrence of a forward slash in completefilename and store it in the variable lastslash. The filename itself comes immediately after the last slash in any URL.

    var just_the_file_name = completefilepath.substring(lastslash+1) uses the substring function to pull out the filename and store it in the variable var just_the_file_name. The substring function takes "from" and "to" arguments. The from argument is lastslash+1, which is one character after the last slash in the URL, i.e., the filename. I left the "to" argument empty, so the function grabs the text all the way to the end.

-------------------------------------------------------------------------------
*/

    var completefilepath = document.URL;
    var lastslash = completefilepath.lastIndexOf("/");
    var just_the_file_name = completefilepath.substring(lastslash+1);

    var prev_last_slash = prev.lastIndexOf("/");
    var prev_is_index = prev.substring(prev_last_slash+1)

    var next_last_slash = next.lastIndexOf("/");
    var next_is_index = next.substring(next_last_slash+1)

    var index_page = 0
    var slash = ""

    if (prev_is_index == "index.htm" || next_is_index == "index.htm")
    {
        index_page = 1;
        slash = "/"
    }

if (prev.substring(0,7)=="content" || next.substring(0,7)=="content")
{
    slash = "/"
}

/*
alert(
        "completefilepath = " + completefilepath +
        "\nlastslash =" + lastslash +
        "\njust_the_file_name = " + just_the_file_name +
        "\nprev_last_slash = " + prev_last_slash +
        "\nprev_is_index = " + prev_is_index +
        "\nnext_last_slash = " + next_last_slash +
        "\nnext_is_index = " + next_is_index +
        "\nindex_page = " + index_page +
        "\nslash = " + slash +
        "\nprev.substring(0,7) = " + prev.substring(0,7)
    ); //end alert
*/

    //alert("prev.substring(0,6) = " + prev.substring(0,7));

    //alert ("prev_is_index = " + prev_is_index + "\n next_is_index = " + next_is_index + "\nindex_page = " + index_page + "\nslash = " + slash);

    if (prev!="0.htm")
        document.write("<a href=\"" + slash + prev + "\"><img src=\"/images/prev_on.gif\" alt=\"Prev\" width=\"38\" height=\"21\" border=\"0\"></a>");
    else {
        document.write("<img src=\"/images/prev_off.gif\" alt=\"\" width=\"38\" height=\"21\" border=\"0\"></a>");
    }

    if (index_page!=1)
        document.write("<img src=\"/images/item_article.gif\" alt=\"Issue\" width=\"69\" height=\"21\" border=\"0\">");
    else {
        document.write("<img src=\"/images/item_issue.gif\" alt=\"Issue\" width=\"69\" height=\"21\" border=\"0\">");
    }

    if (next!="0.htm" && next!="")
    //Above if statement modified Wednesday, August 29, 2001. Added && clause.
        document.write("<a href=\"" + slash + next + "\"><img src=\"/images/next_on.gif\" alt=\"Next\" width=\"49\" height=\"21\" border=\"0\"></a>");
    else {
        document.write("<img src=\"/images/next_off.gif\" alt=\"\" width=\"49\" height=\"21\" border=\"0\"></a>");
    }

//alert("var just_the_file_name = " + just_the_file_name);

} //end function prevnext()



// ============================================================================

/*
The function gotoc() is called in masthead_table_include.htm. It creates the link to the table of contents for whatever article is on screen.

What's inside the document.write statement is the code used on Annals pages to make the TOC link. The main change is the test code to make sure a link to the table of contents is NOT written onto index.html, which is a table of contents page, or onto any handbuilt pages, for which a table of contents link is meaningless. Handbuilt pages live in the /shared folder, and a test is performed using String.indexOf() to check that a page is not living in the /shared directory before the table of contents link is written to it.

See notes in the function prevnext2() for an explanation of the var statements below. I am using the same ones.
*/

function gotoc() {

var completefilepath = document.URL;
var lastslash = completefilepath.lastIndexOf("/");
var lastpound = completefilepath.lastIndexOf("#");

if (lastpound==-1)
{
    lastpound=completefilepath.length
}

//var just_the_file_name = completefilepath.substring(lastslash+1,lastpound);
var just_the_file_name = completefilepath.substring(lastslash+1,lastpound);

/*
The lastpound variable above is used in determining the just_the_file_name variable. Without it, pages that are loaded with a page anchor in the location bar get just_the_file_name variables that look like:

    index.htm#diag or index.htm#Reso

That would lead the gotoc() function to conclude that the page was not an index page, and it would write in a link to the TOC plus the dateline. But index pages are TOCs, so you don't want a link to one in it.
*/

if (just_the_file_name!="INDEX.HTM" && just_the_file_name!="index.htm" && completefilepath.indexOf("shared")==-1 && completefilepath.indexOf("-A")==-1 && !window.errorpage)

    document.write('<img src="/images/shim.gif" alt="" width="60" height="1" border="0"><A href="index.html" onMouseOut="ImageOut(&#039;tbullet&#039;);" onMouseOver="ImageOver(&#039;tbullet&#039;);"><img src="/images/toc_markertop.gif" alt="Table of Contents" width="86" height="9" border="0"><img name="tbullet" SRC="/images/arrow_left_out.gif" alt="" width="6" height="9" border="0"></A>' + "&nbsp;&nbsp;<b>" + dateline + "</b>");

    else if (completefilepath.indexOf("-A")!=-1 || document.URL.indexOf("editorials")!=-1)
    {
    document.write('<img src="/images/tagline.gif" width="305" height="16">');
    }

    else if (document.URL.indexOf("shared")!=-1)
    {
    document.write('<img src="/images/tagline.gif" width="305" height="16">');
    }

    else if (just_the_file_name=="INDEX.HTM" || just_the_file_name=="index.htm")
    {
    document.write('<img src="/images/shim.gif" alt="" width="158" height="1" border="0">' + "<b>" + dateline + "</b>");
    }

} //end function gotoc

function BACKUP_OF_gotoc() {

var completefilepath = document.URL;
var lastslash = completefilepath.lastIndexOf("/");
var just_the_file_name = completefilepath.substring(lastslash+1);

/*
alert("This is a test window Andrew is using. Ignore it." + "\njust_the_file_name = " + just_the_file_name +
"\n completefilepath.indexOf('shared') = " + ompletefilepath.indexOf("shared"));
*/

if (just_the_file_name!="INDEX.HTM" && just_the_file_name!="index.htm" && completefilepath.indexOf("shared")==-1)

    document.write('<img src="/images/shim.gif" alt="" width="60" height="1" border="0"><A href="index.html" onMouseOut="ImageOut(&#039;tbullet&#039;);" onMouseOver="ImageOver(&#039;tbullet&#039;);"><IMG src="/images/toc_markertop.gif" alt="Table of Contents" width="86" height="9" border="0"><IMG name="tbullet" SRC="/images/arrow_left_out.gif" ALT="" WIDTH="6" HEIGHT="9" BORDER="0"></A>' + "&nbsp;&nbsp;<b>" + dateline + "</b>");

    else {
        document.write('<img src="/images/shim.gif" alt="" width="158" height="1" border="0">' + "<b>" + dateline + "</b>");
    }

} //end function gotoc



/* ============================================================================

The displayPopup() function opens a table or figure popup window. It takes six arguments:

    position,url,name,height,width,evnt

Thom and Ricki's HTML files consistently use the same argument values, except for url. I at first thought to write the variable values into the function, so that in the HTML file it could be called with displayPopup(url).

However, we may want to use the displayPopup() function for something else later, like a help window, which might be displayed at a different size, with a different name, and so on. So rather than hard coding the argument values into the function, I am using the tablefigpop() function to call the displayPopup function, and pass it the standard arguments. Later, we might use a helppop() function to open a help window, and it would call displayPopup and pass it different arguments.
*/

function tablefigpop(url,evnt) {

  displayPopup(1,url,'jcpop',700,650,evnt);

} //end function tablefigpop

var version4 = (navigator.appVersion.charAt(0) == "4");
var popupHandle;

function closePopup() {
	if(popupHandle != null && !popupHandle.closed) popupHandle.close();
}

function displayPopup(position,url,name,height,width,evnt) {

// position=1 POPUP: makes screen display up and/or left, down and/or right
// depending on where cursor falls and size of window to open
// position=2 CENTER: makes screen fall in center
	var properties = "toolbar=no,location=no,height=" + height;
	properties = properties + ",width=" + width;
	var leftprop, topprop, screenX, screenY, cursorX, cursorY, padAmt;
	if(navigator.appName == "Microsoft Internet Explorer") {
		screenY = document.body.offsetHeight;
		screenX = window.screen.availWidth;
	}
	else {
		screenY = window.outerHeight
		screenX = window.outerWidth
	}

	if(position == 1)	{ // if POPUP not CENTER
		if(evnt != null){
			cursorX = evnt.screenX;
			cursorY = evnt.screenY;
		} else {
			cursorX = 10;
			cursorY = 10;
		}
		padAmtX = 2;
		padAmtY = 2;
		if((cursorY + height + padAmtY) > screenY) {

			// make sizes a negative number to move left/up
			padAmtY = (-30) + (height * -1);
			// if up or to left, make 30 as padding amount
		}
		if((cursorX + width + padAmtX) > screenX)	{
			padAmtX = (-30) + (width * -1);
			// if up or to left, make 30 as padding amount
		}
		if(navigator.appName == "Microsoft Internet Explorer") {
			leftprop = cursorX + padAmtX;
			topprop = cursorY + padAmtY;
		}
		else {
			leftprop = (cursorX - pageXOffset + padAmtX);
			topprop = (cursorY - pageYOffset + padAmtY);
	   }
	}
	else{
		leftvar = (screenX - width) / 2;
		rightvar = (screenY - height) / 2;
		if(navigator.appName == "Microsoft Internet Explorer") {
			leftprop = leftvar;
			topprop = rightvar;
		}
		else {
			leftprop = (leftvar - pageXOffset);
			topprop = (rightvar - pageYOffset);
	   }
	}


	properties = properties + ",left=" + leftprop;
	properties = properties + ",top=" + topprop;
	properties = properties + ",scrollbars=yes";
	properties = properties + ",resizable=yes";

	closePopup();
	popupHandle = open(url,name,properties).focus();
}

/*
Ricki can remove the following line from all files. The popup function is now in journal_club.js.

<!--#include virtual="/scripts/popup.html" -->
*/

function printwindow() {
    window.print()
} //end function printwindow


function popup_buttons() {

/*
    The function popup_buttons() writes the buttons into the table and figure popups. It is called in the popup_middle.htm and popup_list_middle.htm includes. It writes up to three buttons: Full Text, Figures/Tables List, and Print. A table or figure popup gets all three. If the popup is a list of tables and figures, it just writes the Full Text button. If the table or figure is the only on in the article, then the Figures/Tables List button is not written, but the other two are.

    It recognizes a list file by the "_FT" before the .htm extension. It distinguishes among the other types of popups by the value of the LIST variable in the HTML file.
*/

//if (list.indexOf("_ft")=="" && document.URL.indexOf("_ft")==!1)

/*
if (window.list)
{
alert(
"This is a window Andrew is using for debugging. \nIgnore it." +
"\n--------------------------------------------------------------------------" +
"\ndocument.URL.indexOf(\"_FT\") = " + document.URL.indexOf("_FT") +
"\n list.indexOf(\"_FT\") = " + list.indexOf("_FT")
); //end alert

} //end if
*/

if (document.URL.indexOf("_FT")!=-1)

{
    document.write('<img src="/images/shim.gif" alt="" width="13" height="18" border="0"><a href="javascript:top.window.close()" onMouseOut="ImageOut(\'fulltext\');" onMouseOver="ImageOver(\'fulltext\');"><img name="fulltext" SRC="/images/ft_fulltext_out.gif" alt="Full Text" width="58" height="14" border="0"></a>')
} //end if

else if (document.URL.indexOf("_FT")==-1 && list.indexOf("_FT")=="-1")

{
    document.write('<img src="/images/shim.gif" alt="" width="13" height="18" border="0"><a href="javascript:top.window.close()" onMouseOut="ImageOut(\'fulltext\');" onMouseOver="ImageOver(\'fulltext\');"><img name="fulltext" SRC="/images/ft_fulltext_out.gif" alt="Full Text" width="58" height="14" border="0"></a><a href="#" onClick="printwindow()" onMouseOut="ImageOut(\'winprint\');" onMouseOver="ImageOver(\'winprint\');"><img name="winprint" src="/images/ft_print_out.gif" alt="Print" width="40" height="14" border="0"></a>')
} //end else if

else if (document.URL.indexOf("_FT")==-1 && list.indexOf("_FT")!="-1")

{
    document.write('<img src="/images/shim.gif" alt="" width="13" height="18" border="0"><a href="javascript:top.window.close()" onMouseOut="ImageOut(\'fulltext\');" onMouseOver="ImageOver(\'fulltext\');"><img name="fulltext" src="/images/ft_fulltext_out.gif" alt="Full Text" width="58" height="14" border="0"></a><a href="' + list + '" onMouseOut="ImageOut(\'figtablist\');" onMouseOver="ImageOver(\'figtablist\');"><img name="figtablist" src="/images/ft_list_out.gif" alt="Figures/Tables List" width="124" height="14" border="0"></a> <a href="#" onClick="printwindow()" onMouseOut="ImageOut(\'winprint\');" onMouseOver="ImageOver(\'winprint\');"><img name="winprint" src="/images/ft_print_out.gif" alt="Print" width="40" height="14" border="0"></a>')
} //end else if

} //end function popup_buttons

/*
    The function tocinsert is called in the toc_content_and_nav_table_top.htm include.
*/

function tocinsert() {

    if (window.current && document.URL.indexOf("editorials")== -1)
        document.write("CURRENT TABLE OF CONTENTS")

    else if (document.URL.indexOf("editorials")== -1)
        document.write("TABLE OF CONTENTS")

    else
        document.write("EDITORIALS AND RESOURCE CORNER TABLE OF CONTENTS")

} //end function tocinsert

/*
The function writecaption() is called in the popup include popup_middle.htm. It takes a caption for a figure or table and writes it in with proper surrounding tags. It first has to separate out the phrase Figure 1 or Table 1, or whatever number, so it can add the proper bold tags around it.
*/

function writecaption() {

if (window.caption && caption!="")
{

var period=caption.indexOf(".");
var beginning=caption.substring(0,period+1);
var therest=caption.substring(period+1,caption.length);

document.write("<font class=\"heading4blk\"><b>" + beginning + "</b></font>" + "<font class=\"textblack\">" + therest + "</font>");

} //end if

} //end function writecaption

