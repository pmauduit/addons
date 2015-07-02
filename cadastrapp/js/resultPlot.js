
	/** api: (define)
	*  module = GEOR
	*  class = Cadastrapp
	*  base_link = `Ext.util.Observable <http://extjs.com/deploy/dev/docs/?class=Ext.util.Observable>`_
	*/
Ext.namespace("GEOR")

	//type de grille spécifique :
	//detailParcelles : liste des fenetres filles ouvertes
	GEOR.ResultParcelleGrid = Ext.extend(Ext.grid.GridPanel, {
		detailParcelles: new Array(),
		fichesCOuvertes: new Array(),
		idParcellesCOuvertes: new Array(),
		fichesFOuvertes: new Array(),
		idParcellesFOuvertes: new Array(),
	});


	var resultParcelleWindow;
	var tabCounter = 1;

  	/** public: method[onClickRechercheProprietaire]
     *  :param layer: 
     *  Create ...TODO
     */
	addNewResultParcelle = function(title, result) {
		addNewResult(title, result, OpenLayers.i18n('cadastrapp.parcelle.result.nodata'));
	}
	
	addVoidResultParcelle = function() {
		addNewResult(OpenLayers.i18n('cadastrapp.parcelle.result.selection.title'), null, OpenLayers.i18n('cadastrapp.parcelle.result.selection.content'));
	}
	
    addNewResult = function(title, result, message) {
		if (resultParcelleWindow == null) {
			initResultParcelle();
		}
		
		resultParcelleWindow.show();
		tabs = resultParcelleWindow.items.items[0];
		//**********
			tabs.addListener('beforetabchange',function(tab, newTab, currentTab ){
				var store;
				if (currentTab) { // cad la table de resultats est ouverte et on navigue entre les onglets,  sinon toute selection en bleue sur la carte va redevenir jaune
					if (currentTab.store) {
						store =currentTab.store.data.items;
						changeStateParcelleOfTab(store,"tmp"); // deselection des parcelles
					}
				
					if (newTab) {
						if (newTab.store) {
							store =newTab.store.data.items;
							changeStateParcelleOfTab(store,"yellow"); //selection en jaune
							var selectedRows=newTab.getSelectionModel().selections.items ; 
							changeStateParcelleOfTab(selectedRows,"blue"); //selection en bleue 
						}
					}
				}	
			});
		
		//**********

		tabCounter = tabCounter+1;
		
		newGrid = new GEOR.ResultParcelleGrid({
			title: title,
			id: 'resultParcelleWindowTab'+tabCounter,
			height: 300,
			border: true,
            closable: true,
			
			store: (result!=null) ? result : new Ext.data.Store(),
	        
			colModel: getResultParcelleColModel(),
			multiSelect: true,
			viewConfig: {
				deferEmptyText: false,
				emptyText: message
			},
			
			listeners: {
				close: function(grid) {
					//on ferme toutes les fenetres filles : detail parcelle
					for	(var index = 0; index < grid.detailParcelles.length; index++) {
						if (grid.detailParcelles[index] != undefined) {
							grid.detailParcelles[index].close();
						}
					}
					//on ferme la fenetre si c'est le dernier onglet
					if (tabs.items.length==2) {
						//si il ne reste que cet onglet et l'onglet '+', fermer la fenetre
						resultParcelleWindow.close();
					} else {
						//on selectionne manuellement le nouvel onglet à activer, pour eviter de tomber sur le '+' (qui va tenter de refaire un onglet et ça va faire nimporte quoi)
						var index = tabs.items.findIndex('id', grid.id);
						tabs.setActiveTab((index==0) ? 1 : (index-1));
						//*************
						// quand on ferme l'onglet on deselectionne toutes les parcelles
						store =grid.store.data.items;
						changeStateParcelleOfTab(store,"reset");
						//*************
					}

				},
			}
		
		});
		newGrid.addListener("rowclick",function(grid, rowIndex, e) {
			// on parcourant le tableau de façon générique on gérera les cas de selection simple et multiple pour tout les cliques sue les lignes
			var selection  = grid.getSelectionModel();
			var id,index,feature;
			for(var i=0; i<grid.store.getCount(); i++) { // on parcour tout le tableau
				id =grid.store.getAt(i).data.parcelle;
				feature = getFeatureById(id);
				if(selection.isSelected(i)){ // si ligne selectionnée
						openFoncierOrCadastre(id,grid);
						if (feature)
							changeStateFeature(feature, -1, "blue");
				}else {
						closeFoncierAndCadastre(id,grid);
						if (feature)
							changeStateFeature(feature, -1, "yellow");								
					
				}
			
			}

		});


		var parcelle;
		for(var i=0; i<newGrid.getStore().totalLength; i++) {
			parcelle = newGrid.getStore().getAt(i);
			getFeaturesWFSAttribute(parcelle.data.parcelle);
		}
		
		tabs.insert(0, newGrid);
		tabs.setActiveTab(0);
	}
	
	changeStateParcelleOfTab = function(store,typeSelector){ // met à jour l'état des parcelles en fonction de l'évènement sur l'onglet
		var  id,index,feature;
		for(var i=0; i<store.length  ; i++) { //selection
							id=store[i].data.parcelle ;
							feature = getFeatureById(id);
							if (feature){
								index=indexFeatureSelected(feature);
								changeStateFeature(feature, index, typeSelector);
							}
		}
	
	}
    openFoncierOrCadastre = function(id,grid) {
		cadastreExiste = (grid.idParcellesCOuvertes.indexOf(id) != -1)
		foncierExiste = (grid.idParcellesFOuvertes.indexOf(id) != -1)
		if (isFoncier() && isCadastre()){
			if (!foncierExiste) 
				grid.detailParcelles.push(onClickDisplayFIUF(id));
			if (!cadastreExiste)
				grid.detailParcelles.push(onClickDisplayFIUC(id));
			return "2";
		}else if (isCadastre()){
					if (!cadastreExiste) 
						grid.detailParcelles.push(onClickDisplayFIUC(id));
					return "F"	;
				}
			  else if (isFoncier()) {
						if (!foncierExiste) 
							grid.detailParcelles.push(onClickDisplayFIUF(id));
						return "C";
					}
		return "0"	;								
	}
    closeFoncierAndCadastre = function(idParcelle,grid) {
		cadastreExiste = (grid.idParcellesCOuvertes.indexOf(idParcelle) != -1)
		foncierExiste = (grid.idParcellesFOuvertes.indexOf(idParcelle) != -1)
		if (cadastreExiste) 
			closeWindowFIUC(idParcelle,grid);
		if (foncierExiste) 
			closeWindowFIUF(idParcelle,grid);
								
	}
    
    initResultParcelle = function() {						
		//fenêtre principale
    	resultParcelleWindow = new Ext.Window({
			title: OpenLayers.i18n('cadastrapp.parcelle.result.title'),
			frame: true,
			autoScroll:true,
			minimizable: false,
			closable: true,
			resizable: true,
			draggable : true,
			constrainHeader: true,
			
			border:false,
			width: 600,
			defaults: {autoHeight:true},
			
			listeners: {
				close: function(window) {
					
					//*********************
					// remettre le style de la couche à zero
					clearLayerSelection();
					closeAllWindowFIUC();
					closeAllWindowFIUF();
					//*********************
					resultParcelleWindow = null;
				},
				show: function(window)  {
				// lors du changement entre onglets : deselection de toutes les parcelles et selection de celles du nouvel onglet

				}
			},
			
			items: [
			{
				xtype:'tabpanel',
				
				items: [{
					xtype: 'panel',
					title: '+',
					border: true,
					closable: false,
					
					listeners: {
						activate: function(grid) {
							addVoidResultParcelle();
						}
					}
				}]
			}],
			
			buttons: [
			{
				text: OpenLayers.i18n('cadastrapp.close'),
				listeners: {
					click: function(b,e) {
						resultParcelleWindow.close();
					}
				}
			}]
		});
	};