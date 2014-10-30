(function($,ui){
    
var themes = [
    'default',
    '3024-day',
    '3024-night dark-ui',
    'ambiance dark-ui',
    'base16-dark dark-ui',
    'base16-light',
    'blackboard dark-ui',
    'cobalt dark-ui',
    'eclipse',
    'elegant',
    'erlang-dark dark-ui',
    'lesser-dark dark-ui',
    'mbo dark-ui',
    'midnight dark-ui',
    'monokai dark-ui',
    'neat',
    'night dark-ui',
    'paraiso-dark dark-ui',
    'paraiso-light',
    'pastel-on-dark dark-ui',
    'rubyblue dark-ui',
    'solarized',
    'the-matrix dark-ui',
    'tomorrow-night-eighties dark-ui',
    'twilight dark-ui',
    'vibrant-ink dark-ui',
    'xq-dark dark-ui',
    'xq-light'
];    
    
ui.optionsCombo = teacss.ui.Combo.extend({
    init: function (options) {
        this.defaults = {
            fontSize: 14,
            tabSize: 4,
            useTab: false
        }

        var ui = teacss.ui;
        var me = this;
        var panel,check;
        
        var themeOptions = {};
        $.each(themes,function(t,theme){ themeOptions[theme] = theme.split(" ")[0]; });
        
        this.form = ui.form(function(){
            panel = ui.panel({width:"100%",height:'auto',margin:0,padding:"5px 10px 10px"}).push(
                ui.label({template:'Font size: ${value}px',name:'fontSize',margin:"5px 0"}),
                ui.slider({min:10,max:24,margin:"0px 15px 0px",name:'fontSize'}),
                ui.label({template:'Tab size: ${value}',name:'tabSize',margin:"5px 0"}),
                ui.slider({min:1,max:16,margin:"0px 15px 0px",name:'tabSize'}),
                check = ui.check({margin:"10px 15px 5px 15px",width:'100%',label:'Use tab character',name:'useTab'}),
                ui.label({template:'Theme:',margin:"5px 0"}),
                ui.select({name: 'theme', items: themeOptions,width:"100%", comboDirection: 'right', comboHeight: 1000, margin: "-3px 0 0 0" })
            );
        });
        check.element.css("font-size",10);
        this._super($.extend({comboWidth:200},options,{items:[panel]}));
        this.loadValue();
        this.form.bind("change",function(){
            me.value = me.form.value;
            me.updateOptions();
            me.trigger("change");
            me.saveValue();
        });
        this.updateOptions();
    },
    saveValue: function () {
        dayside.storage.set("options",this.value);
    },
    loadValue: function () {
        this.value = $.extend({},this.defaults,dayside.storage.get("options",{}));
        this.form.setValue(this.value);
    },
    updateOptions: function () {
        var ui = teacss.ui;
        var value = this.value;

        var theme = value.theme || 'default';
        $("body").attr("class","cm-s-"+theme);

        // apply indent settings to CodeMirror defaults and opened editors
        CodeMirror.defaults.tabSize = value.tabSize;
        CodeMirror.defaults.indentUnit = value.tabSize;
        CodeMirror.defaults.indentWithTabs = value.useTab;

        for (var t=0;t<ui.codeTab.tabs.length;t++) {
            var e = ui.codeTab.tabs[t].editor;
            if (e) {
                e.setOption("tabSize",value.tabSize);
                e.setOption("indentUnit",value.tabSize);
                e.setOption("indentWithTabs",value.useTab);
            }
        }             

        // create dynamic CSS node to reflect fontSize changes for CodeMirror
        var styles = $("#ideStyles");
        if (styles.length==0) {
            styles = $("<style>").attr({type:"text/css",id:"ideStyles"}).appendTo("head");
        }
        styles.html(".CodeMirror {font-size:"+value.fontSize+"px !important; }");
        for (var t=0;t<ui.codeTab.tabs.length;t++) {
            var e = ui.codeTab.tabs[t].editor;
            if (e) e.refresh();
        }            
    }  
});
    
})(teacss.jQuery,teacss.ui);