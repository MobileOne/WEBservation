var SessionStore = Class({
  	store : null,
    initialize : function ( local) { 
    	this.store = local ? localStorage : sessionStorage;
    },

    setItem : function( key, value){
    	if ( key) this.store.setItem( key, value);
    },

	getItem : function( key){
    	if ( key) return this.store.getItem( key);
    },

    removeItem : function( key){
    	if ( key) this.store.removeItem( key);
    },

    setJson : function (key, value){
    	if ( key) this.store.setItem( key, JSON.stringify(value));
    },

    getJson : function( key){
    	if ( key) return JSON.parse(this.store.getItem( key));
    },

    clear : function(){
    	this.store.clear();
    }
});
var session = new SessionStore( false);
var local   = new SessionStore( true);
