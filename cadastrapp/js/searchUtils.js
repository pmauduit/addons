
	/** api: (define)
	*  module = GEOR
	*  class = Cadastrapp
	*  base_link = `Ext.util.Observable <http://extjs.com/deploy/dev/docs/?class=Ext.util.Observable>`_
	*/
Ext.namespace("GEOR")

	//liste des compléments de numéro de rue : BIS, TER (à compléter ?)
	//statique
	getBisStore = function() {
		return new Ext.data.JsonStore({
			fields : ['name', 'value'],
			data   : [
				{name : '--', value: ''},
				{name : 'bis', value: 'B'},
				{name : 'ter', value: 'T'},
				{name : 'quater', value: 'Q'},
				{name : 'A', value: 'A'},
				{name : 'B', value: 'B'},
				{name : 'C', value: 'C'},
				{name : 'D', value: 'D'},
				{name : 'E', value: 'E'},
				{name : 'F', value: 'F'},
				{name : 'G', value: 'G'},
				{name : 'H', value: 'H'}
			]
		});		
	}
		
	//liste des villes
	getPartialCityStore = function() {
		return new Ext.data.JsonStore({
			proxy: new Ext.data.HttpProxy({
                url: getWebappURL() + 'getCommune',
                method: 'GET'
             }),
			fields: ['ccoinsee', 'libcom', 'libcom_min', { 
		       name: 'displayname', 
		       convert: function(v, rec) { return rec.libcom_min.trim() + ' (' + rec.ccoinsee.trim() + ')'}
		    }]
		});
	}
	
		
	//liste des sections	
	getSectionStore = function(cityId) {
		if (cityId!=null) {
			return new Ext.data.JsonStore({
				url: getWebappURL() + 'getSection?ccoinsee=' + cityId,
				autoLoad: true,
				fields: ['ccoinsee', 'ccopre', 'ccosec', 'geo_section',
					{ 
				       name: 'fullccosec', 
				       convert: function(v, rec) { return rec.ccopre + rec.ccosec; }
				    }]
			});
		} else {
			return new Ext.data.JsonStore({
				data: [],
				fields: ['ccoinsee', 'ccopre', 'ccosec', 'geo_section', 'fullccosec']
			});
		}
	}
	
	//liste des parcelles
	getInitParcelleStore = function() {
		return new Ext.data.JsonStore({
			proxy: new Ext.data.HttpProxy({
                url: getWebappURL() + 'getParcelle',
                method: 'GET'
             }),
			fields : ['parcelle', 'ccodep', 'ccodir', 'ccocom', 'ccopre', 'ccosec', 'dnupla', 'dnvoiri', 'dindic', 'dvoilib']
		});
	}
	reloadParcelleStore = function(parcelleStore, cityId, sectionId) {
		if (parcelleStore!=null && cityId!=null && sectionId!=null) {
			var prefix = sectionId.substring(0, sectionId.length-2);
			var section = sectionId.substring(sectionId.length-2, sectionId.length);
			
			parcelleStore.load({params: {
				details: 1,
				ccodep: cityId.substring(0,2),
				ccodir: cityId.substring(2,3),
				ccocom: cityId.substring(3,6),
				ccopre: prefix,
				ccosec: section,
			}});
		}
	}
	
	
	
		
	//liste des propriétaires d'une ville
	//TODO : charger dynamiquement selon la ville choisie
	getProprietaireStore = function(cityId) {		
		if (cityId!=null) {
			return new Ext.data.JsonStore({
				url: getWebappURL() + 'getProprietaire?ccoinsee=' + cityId,
				autoLoad: true,
				fields: ['ccoinsee', 'ccopre', 'ccosec', 'geo_section',
					{ 
				       name: 'fullccosec', 
				       convert: function(v, rec) { return (rec.ccopre.trim().length>0) ? (rec.ccopre.trim() + '-' + rec.ccosec.trim()) : rec.ccosec.trim(); }
				    }]
			});
		} else {
			return new Ext.data.JsonStore({
				data: [],
				fields: ['ccoinsee', 'ccopre', 'ccosec', 'geo_section', 'fullccosec']
			});
		}
	}
		
	//listes des section / parcelles saisies : "références"
	//initialement vide
	//ajoute automatique une ligne vide quand la dernière ligne est complètement remplie
	//actuellement, on ne peut pas supprimer une ligne
	getVoidParcelleStore = function() {
		return new Ext.data.JsonStore({
			fields : ['section', 'parcelle'],
			data   : [{section : '',   parcelle: ''}]
		});		
	}
	
	//listes des "propriétaires" saisis
	//initialement vide
	getVoidProprietaireStore = function() {
		return new Ext.data.JsonStore({
			fields : ['proprietaire'],
			data   : [{proprietaire : ''}]
		});		
	}
	
	//design et editor des colonnes de la grille "référence"
	getParcelleColModel = function(cityId) {
		return new Ext.grid.ColumnModel([
			{
				id:'section',
				dataIndex: 'section',
				header: OpenLayers.i18n('cadastrapp.parcelle.references.col1'),
				width: 100,
				sortable: false,
				editor: new Ext.form.ComboBox({
					mode: 'local',
					value: '',
					forceSelection: false,
					editable:       true,
					displayField:   'fullccosec',
					valueField:     'fullccosec',
					store: getSectionStore(cityId),
					listeners: {
					    beforequery: function(q){  
					    	if (q.query) {
				                var length = q.query.length;
				                q.query = new RegExp(Ext.escapeRe(q.query), 'i');
				                q.query.length = length;
				            }
					    }
					}					
				})
			},
			{
				id: "parcelle",
				dataIndex: 'parcelle',
				header: OpenLayers.i18n('cadastrapp.parcelle.references.col2'),
				width: 100,
				sortable: false,
				renderer: function(value, metadata, record, rowIndex, colIndex, store) {
					//on affiche le numéro du plan depuis l'id de la parcelle
					return (value!=undefined && value.length >= 4) ? (value.substring(value.length-4)) : null;
				},				
				editor: new Ext.form.ComboBox({
					mode: 'local',
					value: '',
					forceSelection: false,
					editable:       true,
					displayField:   'dnupla',			//on affiche dans les choix le numéro du plan (4 dernier chiffres de l'id de la parcelle)
					valueField:     'parcelle',			//on conservec comme valeur l'id entier de la parcelle
					store: getInitParcelleStore(),
					listeners: {
					    beforequery: function(q){  
					    	if (q.query) {
				                var length = q.query.length;
				                q.query = new RegExp(Ext.escapeRe(q.query), 'i');
				                q.query.length = length;
				            }
					    }
					}
				})
			}
		]);		
	}
	
	
	//design de la grille "resultats de recherche de parcelles"
	getResultParcelleColModel = function() {
		return new Ext.grid.ColumnModel([
			{
				id:'ccoinsee',
				dataIndex: 'ccoinsee',
				header: OpenLayers.i18n('cadastrapp.parcelle.result.commune'),
				sortable: true
			},
			{
				id:'ccosec',
				dataIndex: 'ccosec',
				header: OpenLayers.i18n('cadastrapp.parcelle.result.ccosec'),
				sortable: true
			},
			{
				id:'dnupla',
				dataIndex: 'dnupla',
				header: OpenLayers.i18n('cadastrapp.parcelle.result.dnupla'),
				sortable: true
			},
			{
				id:'adresse',
				dataIndex: 'adresse',
				header: OpenLayers.i18n('cadastrapp.parcelle.result.adresse'),
				sortable: true
			},
			{
				id:'surface',
				dataIndex: 'surface',
				header: OpenLayers.i18n('cadastrapp.parcelle.result.surface'),
				sortable: true
			}]);
	}
	
	
	//design et editor des colonnes de la grille "propriétaires"
	getProprietaireColModel = function(cityId) {
		return new Ext.grid.ColumnModel([
			{
				id:'proprietaire',
				dataIndex: 'proprietaire',
				header: OpenLayers.i18n('cadastrapp.proprietaire.proprietaires.col1'),
				width: 100,
				sortable: false,
				editor: new Ext.form.TextField({ allowBlank: false })
			}
		]);		
	}
	
	
	getResultParcelleStore = function (result, fromForm) {
		return new Ext.data.JsonStore({
			fields: ['parcelle', 'ccodep', 'ccodir', 'ccocom', 'ccopre', 'ccosec', 'dnupla', 'dnvoiri', 'dindic', 'dvoilib', 'surface',
			         { 
			       		name: 'ccoinsee', 
			       		convert: function(v, rec) { return rec.ccodep + rec.ccodir + rec.ccocom; }
			         },
			         { 
			       		name: 'adresse', 
			       		convert: function(v, rec) {
			       			return rec.dnvoiri + rec.dindic + ' ' + rec.dvoilib;
			       		}
			         }],
			data: (fromForm) ? Ext.util.JSON.decode(result).data : Ext.util.JSON.decode(result)
		});		
	}
	/*
	getResultFicParcelleStore = function (result, fromForm) {
		return new Ext.data.JsonStore({
			fields: ['parcelle', 'ccodep', 'ccodir', 'ccocom', 'ccopre', 'ccosec', 'dnupla', 'dnvoiri', 'dindic', 'dvoilib', 'surface',
			         { 
			       		name: 'ccoinsee', 
			       		convert: function(v, rec) { return rec.ccodep + rec.ccodir + rec.ccocom; }
			         },
			         { 
			       		name: 'ccosec', 
			       		convert: function(v, rec) {
			       			return rec.gcopre + rec.ccosec;
			       		},
						
			         { 
			       		name: 'dnupla', 
			       		convert: function(v, rec) {
			       			return rec.dnupla;
			       		},
						{ 
			       		name: 'adresse', 
			       		convert: function(v, rec) {
			       			return rec.dnvoiri + rec.dindic + ' ' + rec.dvoilib;
			       		},
						{ 
			       		name: 'dvoilib', 
			       		convert: function(v, rec) {
			       			return rec.natvoiriv_lib + ' ' + rec.dvoilib;
			       		},
						{ 
			       		name: 'dcntpa', 
			       		convert: function(v, rec) {
			       			return rec.dcntpa  + 'm2';
			       		},
						{ 
			       		name: 'supf', 
			       		convert: function(v, rec) {
			       			return rec.supf  + 'm2';
			       		},
						{ 
			       		name: 'gparbat', 
			       		convert: function(v, rec) {
			       			return rec.gparbat;
			       		},
						{ 
			       		name: 'gurbpa', 
			       		convert: function(v, rec) {
			       			return rec.gurbpa;
			       		}
			         }],
			data: (fromForm) ? Ext.util.JSON.decode(result).data : Ext.util.JSON.decode(result)
		});		
	}*/
	
	
	