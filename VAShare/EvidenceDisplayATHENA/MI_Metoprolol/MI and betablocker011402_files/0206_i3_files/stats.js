function stats(ID, Server, Group, Order)
{
  var time = new Date();
  var tv = time.getYear()+"-"+time.getMonth()+"-"+time.getDate()+" "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();

  var P="http://stats.siteconfidence.co.uk/stats/counter.php?";
  P+="ID="+ID;
  P+="&grp="+Group;
  P+="&srv="+Server;
  P+="("d="+Order;
  P+="&bd="+tv;
  P+="&ti="+escape(document.title);
  P+="&tz="+time.getTimezoneOffset();
  P+="&ex="+time.getMilliseconds();
  P+="&url="+window.document.URL;
  P+="&ver=1";
  P+="&jav=1";
  P+="&ref="+escape(window.document.referrer);
  P+="&av="+escape(navigator.appVersion);
  P+="&ap="+escape(navigator.appName);
  P+="&ck="+(navigator.cookieEnabled?"Yes":"No");
  P+="&lg="+(navigator.appName=="Netscape"?navigator.language:navigator.userLanguage);
  P+="&os="+navigator.platform;
  if(typeof(screen)=="object")
  {
    P+="&cd="+screen.colorDepth;
    P+="&sr="+screen.width+"x"+screen.height;
    P+="&pl=";
    for(var x=0; x< navigator.plugins.length; x++)
      P+=escape(navigator.plugins[x].name)+";";
  }

  if (navigator.appName == 'Netscape' && document.layers != null)
  {
    P+="&iw="+window.innerWidth;
    P+="&ih="+window.innerHeight;
  }
  if (document.all != null)
  {
    P+="&iw="+document.body.clientWidth;
    P+="&ih="+document.body.clientHeight;
  }

  document.write('<IMG SRC="../../MI_and_metoprolol%20092101/MI%20and%20betablocker011402_files/0206_i3_files/%27%20%2B%20P%20%2B%20%27" WIDTH=1 HEIGHT=1 BORDER=0>');
}
