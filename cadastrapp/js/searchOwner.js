
	/** api: (define)
	*  module = GEOR
	*  class = Cadastrapp
	*  base_link = `Ext.util.Observable <http://extjs.com/deploy/dev/docs/?class=Ext.util.Observable>`_
	*/
Ext.namespace("GEOR")

	var proprietaireWindow;

  	/** public: method[onClickRechercheProprietaire]
     *  :param layer: 
     *  Create ...TODO
     */
    onClickRechercheProprietaire1 = function() {
		if (proprietaireWindow == null) {
			initRechercheProprietaire();
		}
		proprietaireWindow.show();
		proprietaireWindow.items.items[0].setActiveTab(0);
	}
	
    onClickRechercheProprietaire2 = function() {
		if (proprietaireWindow == null) {
			initRechercheProprietaire();
		}
		proprietaireWindow.show();
		proprietaireWindow.items.items[0].setActiveTab(1);
	}
	
    initRechercheProprietaire = function(){
		var propCityCombo1, propCityCombo2, proprietaireGrid;
				
		//comboboxes "villes"
		propCityCombo1 = new Ext.form.ComboBox({
			fieldLabel: OpenLayers.i18n('cadastrapp.proprietaire.city'),
			hiddenName: 'ccoinsee',
            allowBlank:false,
			width: 300,
			mode: 'local',
			value: '',
			forceSelection: true,
			editable: true,
			displayField: 'displayname',
			valueField: 'ccoinsee',
			store: getPartialCityStore(),
			listeners: {
				beforequery: function(q){  
			    	if (q.query) {
		                var length = q.query.length;
		                if (length == getSearchStart()) {
		                	if (isNaN(q.query)) {
		                		//recherche par nom de ville
		                		q.combo.getStore().load({params: {libcom_partiel: q.query}});
		                	} else {
		                		//recherche par code insee
		                		q.combo.getStore().load({params: {ccoinsee_partiel: q.query}});
		                	}		                	
		                } else if (length < getSearchStart()) {
		                	q.combo.getStore().loadData([],false);
		                }
		                q.query = new RegExp(Ext.escapeRe(q.query), 'i');
		                q.query.length = length;
		            }
			    },
				change: function(combo, newValue, oldValue) {
					proprietaireWindow.buttons[0].enable();
				}
			}
		});	
		
		propCityCombo2 = new Ext.form.ComboBox({
			fieldLabel: OpenLayers.i18n('cadastrapp.proprietaire.city'),
			hiddenName: 'ccoinsee',
            allowBlank:false,
			width: 300,
			mode: 'local',
			value: '',
			forceSelection: true,
			editable: true,
			displayField: 'displayname',
			valueField: 'ccoinsee',
			store: getPartialCityStore(),
			listeners: {
			    beforequery: function(q){  
			    	if (q.query) {
		                var length = q.query.length;
		                if (length == getSearchStart()) {
		                	if (isNaN(q.query)) {
		                		//recherche par nom de ville
		                		q.combo.getStore().load({params: {libcom_partiel: q.query}});
		                	} else {
		                		//recherche par code insee
		                		q.combo.getStore().load({params: {ccoinsee_partiel: q.query}});
		                	}		                	
		                } else if (length < getSearchStart()) {
		                	q.combo.getStore().loadData([],false);
		                }
		                q.query = new RegExp(Ext.escapeRe(q.query), 'i');
		                q.query.length = length;
		            }
			    },
				change: function(combo, newValue, oldValue) {
					//refaire le section store pour cette ville						
					//proprietaireGrid.reconfigure(getVoidProprietaireStore(), getProprietaireColModel(newValue));
					proprietaireWindow.buttons[0].enable();
				}
			}
		});			
		
		//grille "proprietaires"
		proprietaireGrid = new Ext.grid.EditorGridPanel({
			fieldLabel: OpenLayers.i18n('cadastrapp.proprietaire.proprietaires'),
			name: 'proprietaires',							
			xtype: 'editorgrid',
			clicksToEdit: 1,
			ds: getVoidProprietaireStore(),
			cm: getProprietaireColModel(''),
			autoExpandColumn: 'proprietaire',
			height: 100,
			width: 300,
			border: true,
			listeners: {
				beforeedit: function(e) {
					if (e.column == 0) {
						//pas d'edition de section si aucune ville selectionnée
						if (propCityCombo2.value == '') return false;
					}
				},
				afteredit: function(e) {
					var lastIndex = e.grid.store.getCount()-1;
					var lastData = e.grid.store.getAt(e.grid.store.getCount()-1).data;
					
					if (lastData.proprietaire!='') {
						var p = new e.grid.store.recordType({proprietaire:''}); // create new record
						e.grid.stopEditing();
						e.grid.store.add(p); // insert a new record into the store (also see add)
						this.startEditing(e.row + 1, 0);
					}
				}
			}
		});
		
				
		//fenêtre principale
		proprietaireWindow = new Ext.Window({
			title: OpenLayers.i18n('cadastrapp.proprietaire.title'),
			frame: true,
			autoScroll:true,
			minimizable: false,
			closable: true,
			resizable: false,
			draggable : true,
			constrainHeader: true,
			
			border:false,
			labelWidth: 100,
			width: 450,
			defaults: {autoHeight: true, bodyStyle:'padding:10px', flex: 1},
			
			listeners: {
				close: function(window) {
					proprietaireWindow = null;
				}
			},
			
			items: [
			{
				xtype:'tabpanel',
				activeTab: 0,
				
				items:[{
				
					//ONGLET 1
					id: 'propFirstForm',
					xtype: 'form',
					title: OpenLayers.i18n('cadastrapp.proprietaire.title.tab1'),
					defaultType: 'displayfield',
					height: 200,
								
					items: [
					propCityCombo1,
					{
						value: OpenLayers.i18n('cadastrapp.proprietaire.city.exemple'),
						fieldClass: 'displayfieldGray'
					},
					{
						xtype: 'textfield',
						fieldLabel: OpenLayers.i18n('cadastrapp.proprietaire.lastname'),
						name: 'dnomlp',
			            allowBlank:false,
						width: 300
					},
					{
						value: OpenLayers.i18n('cadastrapp.proprietaire.lastname.exemple'),
						fieldClass: 'displayfieldGray'
					},
					{
						xtype: 'textfield',
						fieldLabel: OpenLayers.i18n('cadastrapp.proprietaire.firstname'),
						name: 'dprnlp',
						width: 300
					},
					{
						value: OpenLayers.i18n('cadastrapp.proprietaire.firstname.exemple'),
						fieldClass: 'displayfieldGray'
					}]
				},{
				
					//ONGLET 2
					id: 'propSecondForm',
					xtype: 'form',
					title: OpenLayers.i18n('cadastrapp.proprietaire.title.tab2'),
					defaultType: 'displayfield',
					fileUpload: true,
					height: 200,

					items: [
					propCityCombo2,
					{
						value: OpenLayers.i18n('cadastrapp.proprietaire.city.exemple'),
						fieldClass: 'displayfieldGray'
					},
					proprietaireGrid,	//grille "proprietaires"
					{
						value: OpenLayers.i18n('cadastrapp.proprietaire.or'),
						fieldClass: 'displayfieldCenter'
					},
					{
						fieldLabel: OpenLayers.i18n('cadastrapp.proprietaire.file.path'),
						name: 'filePath',
						xtype: 'fileuploadfield',
						emptyText: OpenLayers.i18n('cadastrapp.proprietaire.file.exemple'),
						buttonText: OpenLayers.i18n('cadastrapp.proprietaire.file.open'),
						height: 25,
						width: 300
					}]
				}]
			}],
			
			buttons: [{
				text: OpenLayers.i18n('cadastrapp.search'),
				//disabled: true,
				listeners: {
					click: function(b,e) {
						var currentForm = proprietaireWindow.items.items[0].getActiveTab();
						if (currentForm.id == 'propFirstForm') {
							if (currentForm.getForm().isValid()) {								
								//TITRE de l'onglet resultat
								var resultTitle = currentForm.getForm().findField('ccoinsee').lastSelectionText;
								
								//PARAMS
								var params = currentForm.getForm().getValues();
								params.details = 1;
								var cityCode = currentForm.getForm().findField('ccoinsee').value;
								params.ccodep = cityCode.substring(0,2);
								params.ccodir = cityCode.substring(2,3);
								params.ccocom = cityCode.substring(3,6);

								//envoi des données d'une form
								Ext.Ajax.request({
									method: 'GET',
									url: getWebappURL() + 'getParcelle',
									params: params,
									success: function(result) {
										addNewResultParcelle(resultTitle, getResultParcelleStore(result.responseText, false));
									},
									failure: function(result) {
										alert('ERROR');
									}
								});
							}
							
						} else {
							if (currentForm.getForm().isValid()) {
								//TITRE de l'onglet resultat
								var resultTitle = currentForm.getForm().findField('ccoinsee').lastSelectionText;
								
								if (currentForm.getForm().findField('filePath').value != undefined) {
									//PAR FICHIER									

									//soumet la form (pour envoyer le fichier)
									currentForm.getForm().submit({								
										method: 'POST',
										url: getWebappURL() + 'getParcelle/fromProprietairesFile',
										params: {details: 1},
										success: function(form, action) {
											addNewResultParcelle(resultTitle, getResultParcelleStore(action.response.responseText, true));
										},
										failure: function(form, action) {
											alert('ERROR : ' + action.response.responseText);
										}
									});
									
								} else {
									//PAR LISTE
									
									//PARAMS
									var params = currentForm.getForm().getValues();
									params.details = 1;
									var cityCode = currentForm.getForm().findField('ccoinsee').value;
									params.ccodep = cityCode.substring(0,2);
									params.ccodir = cityCode.substring(2,3);
									params.ccocom = cityCode.substring(3,6);
									
									//liste des proprietaires
									params.dnupro = new Array();
									proprietaireGrid.getStore().each(function(record) {  
										params.dnupro.push(record.data.proprietaire); 
									});
									
									//envoi des données d'une form
									Ext.Ajax.request({
										method: 'GET',
										url: getWebappURL() + 'getParcelle',
										params: params,
										success: function(result) {
											addNewResultParcelle(resultTitle, getResultParcelleStore(result.responseText, false));
										},
										failure: function(result) {
											alert('ERROR');
										}
									});
								}
							}
						}
					}
				}
			},{
				text: OpenLayers.i18n('cadastrapp.close'),
				listeners: {
					click: function(b,e) {
						proprietaireWindow.close();
					}
				}
			}]
		});
	};
