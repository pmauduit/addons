/**
 * api: (define) api: (define) module = GEOR class = Cadastrapp base_link = *
 * `Ext.util.Observable
 * <http://extjs.com/deploy/dev/docs/?class=Ext.util.Observable>`_
 */
Ext.namespace("GEOR")

/**
 * public: method[onClickDisplayFIUC] :param layer: Create ...TODO
 */



onClickDisplayFIUC = function(parcellId) {
    // ONGLET 1
	var FiucBatimentsStore;
    
    var FiucParcelleData = [ [ 'Commune', '' ], 
										[ 'Section', '' ],
										[ 'Parcelle', '' ],
										[ 'Voie (Code fantoir)', '' ],
										[ 'Adresse cadastralle', '' ],
										[ 'Contenance DGFiP', '' ],
										[ 'Contenance calculée', '' ],
										[ 'Parcelle bâtie', '' ],
										[ 'Appartient à un secteur urbain', '' ]];

    var FiucParcelleStore = new Ext.data.JsonStore({

		totalProperty : 'total',
        idProperty : "parcellId",
		autoLoad: true,
		//proxy: new Ext.data.HttpProxy({
        url: getWebappURL() + 'getParcelle?parcelle='+parcellId,
        method: 'GET',
/*        fields :[ [ {
            name : 'designation'
        }, {
            name : 'valeur'
        }, ],
			[ {
            name : 'Commune'
        }, {
            data : 'ccodep '+'ccodir '+'ccocom'
        }, ]],        */
//		fields : [ 'dnupla'],
		fields : [ 'designation ','valeur'],
		data:  [ 
					{ "designation":"Commune", "valeur":'ccocom'},
					{"designation": "Section","valeur":"ccosec"},
					{"designation": "Parcelle", "valeur":"Peter Smith"},
					{ "designation":"Voie (Code fantoir)", "valeur":"Tom Smith"},
					{"designation": "Adresse cadastralle", "valeur":"Andy Smith"},
					{ "designation":"Contenance DGFiP", "valeur":"Andy Smith"},
					{"designation": "Contenance calculée", "valeur":"Andy Smith"},
					{ "designation":"Parcelle bâtie", "valeur":"Andy Smith"},
					{"designation": "Appartient à un secteur urbain", "valeur":"Andy Smith"},
				  ],/*
		FiucParcelleData :  [ [ 'Commune', 'ccocom' ], 
										[ 'Section', 'ccosec' ],
										[ 'Parcelle', 'dnupla' ],
										[ 'Voie (Code fantoir)', 'cconvo' ],
										[ 'Adresse cadastralle', '' ],
										[ 'Contenance DGFiP', '' ],
										[ 'Contenance calculée', '' ],
										[ 'Parcelle bâtie', '' ],
										[ 'Appartient à un secteur urbain', '' ]],*/

		
		//data: {[   'ccodep '+'ccodir '+'ccocom' ], ['gcopre'+'ccosec' ],
		//[ 'dnupla' ] ,[ 'dnvoiri' +'dindic'] ,[ 'cconvo'+' ' +'dvoilib' ] ,[ 'dcntpa '+'m2' ] ,[ 'supf ' +'m2'] ,[ 'gparbat' ] ,[ 'gurbpa' ] ]},


		 //name: {['Commune'],[ 'Section'],  [ 'Parcelle' ] ,[ 'Voie (Code fantoir)'] ,[ 'Adresse cadastralle'] ,[ 'Contenance DGFiP'] ,[ 'Contenance calculée'] ,[ 'Parcelle bâtie'] ,[ 'Appartient à un secteur urbain'] }



    });


    var parcelleDownloadPdfButton = new Ext.ButtonGroup({
    	bodyBorder:false,
    	border:false,
    	hideBorders:true,
    	frame : false,
    	items :[
    	        {
    	        	xtype : 'button', 
			        name : 'proprietaireDownloadPdfButton',
			        iconCls : "pdf-button",
			        handler : function () {
			        	// TODO : call PDF function with selected propriete
			        	// see below funtion 
			        	
			        	Ext.Ajax.request({
			        		   url: getWebappURL() + 'createBordereauParcellaire?parcelle='+parcelleId ,
			        		   failure: function(){alert("erreur lors de la création du "+OpenLayers.i18n('cadastrapp.duc.bordereau.parcellaire'))},
			        		   params: { }
		        		});
			        }
    	        }, 
    	        {
    	        	xtype : 'label', 
			        text : OpenLayers.i18n('cadastrapp.duc.bordereau.parcellaire'),
    	        }, 
    ]
    });
    var FiucParcelleGrid = new Ext.grid.GridPanel({
        store : FiucParcelleStore,
        stateful : true,
        height : 500,
        title : 'Bordereau parcellaire',
        name : 'Fiuc_Parcelle',
        xtype : 'editorgrid',

            columns : [
                  {header: "Description", dataIndex: 'description'},
                  {header: "Valeur", dataIndex: 'valeur'}
              ]


    });

 /*       colModel : new Ext.grid.ColumnModel({
            defaults : {
                border : true,
                sortable : false,
            },
            columns : [ {
                header : OpenLayers.i18n('cadastrapp.duc.designation'),
                dataIndex :OpenLayers.i18n('cadastrapp.parcelle.city'),
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.valeur'),
				dataIndex : 'dnupla'}]
        }),

    });*/

    // ONGLET 2
    var FiucProrietaireData = [
            [ "proprietaire1", "proprietaire1", "ano", "proprietaire1",
                    "proprietaire1", "proprietaire1", "proprietaire1",
                    "proprietaire1", "proprietaire1", "proprietaire1",
                    "1900-01-01", "PROPRIETAIRE1" ],
            [ "proprietaire1", "ano", "proprietaire1", "proprietaire1",
                    "proprietaire1", "proprietaire1", "proprietaire1",
                    "proprietaire1", "proprietaire1", "1900-01-01",
                    "PROPRIETAIRE1" ],
            [ "ano", "proprietaire1", "proprietaire1", "proprietaire1",
                    "proprietaire1", "proprietaire1", "proprietaire1",
                    "proprietaire1", "1900-01-01", "PROPRIETAIRE1" ],
            [ "proprietaire1", "proprietaire1", "proprietaire1",
                    "proprietaire1", "proprietaire1", "proprietaire1",
                    "proprietaire1", "1900-01-01", "PROPRIETAIRE1" ],
            [ "proprietaire1", "proprietaire1", "proprietaire1", "ano",
                    "proprietaire1", "proprietaire1", "proprietaire1",
                    "proprietaire1", "proprietaire1", "proprietaire1",
                    "proprietaire1", "1900-01-01", "PROPRIETAIRE1" ],
            [ "proprietaire1", "proprietaire1", "proprietaire1", "ano",
                    "proprietaire1", "proprietaire1", "proprietaire1",
                    "proprietaire1", "proprietaire1", "proprietaire1",
                    "proprietaire1", "1900-01-01", "PROPRIETAIRE1" ],
            [ "proprietaire1", "proprietaire1", "proprietaire1", "ano",
                    "proprietaire1", "proprietaire1", "proprietaire1",
                    "proprietaire1", "proprietaire1", "proprietaire1",
                    "proprietaire1", "1900-01-01", "PROPRIETAIRE1" ] ];

 
    var FiucProprietaireStore = new Ext.data.ArrayStore({
		
        root : '',
        totalProperty : 'total',
        idProperty : "dnupro",
        remoteSort : false,
        autoDestroy : true,
        fields : [ {
            name : 'dnupro'
        }, {
            name : 'dnomlp'
        }, {
            name : 'dprnlp'
        }, {
            name : 'expnee'
        }, {
            name : 'dnomcp'
        }, {
            name : 'dprncp'
        }, {
            name : 'dlign1'
        }, {
            name : 'jdatnss'
        }, {
            name : 'dldnss'
        }, {
            name : 'ccpdro_lib'
        } ],
        // proxy: new Ext.data.HttpProxy({
        // url: getWebappURL() + 'getProprietaire?dnomIp=anonymous',
        // method: 'GET'
        // }),
        data : FiucProrietaireData
    });
    

    var proprietaireDownloadPdfButton = new Ext.ButtonGroup({
    	bodyBorder:false,
    	border:false,
    	hideBorders:true,
    	frame : false,
    	items :[
    	        {
    	        	xtype : 'button', 
			        name : 'proprietaireDownloadPdfButton',
			        iconCls : "pdf-button",
			        handler : function () {
			        	createReleveDePropriete();
			        	// see below funtion 
			        }
    	        }, 
    	        {
    	        	xtype : 'label', 
			        text : OpenLayers.i18n('cadastrapp.duc.releve.depropriete'),
    	        }, 
    ]
    });

    var sm = new Ext.grid.CheckboxSelectionModel();
    var bbar = new Ext.PagingToolbar({
        pageSize : 25,
        store : FiucProprietaireStore,
        displayInfo : true,
        displayMsg : 'Displaying topics {0} - {1} of {2}',
        emptyMsg : "No topics to display",
        items : [ {
            pressed : true,
            enableToggle : true,
            text : 'Show Preview',
            cls : 'x-btn-text-icon details',
            toggleHandler : function(btn, pressed) {
                var view = grid.getView();
                view.showPreview = pressed;
                view.refresh();
            }
        } ]
    });

    FiucProprietairesGrid = new Ext.grid.GridPanel({
        store : FiucProprietaireStore,
        stateful : true,
        height : 500,
        title : 'Relevé de propriété',
        name : 'Fiuc_Proprietaire',
        xtype : 'editorgrid',
        selModel : sm,
        bbar : bbar,
        colModel : new Ext.grid.ColumnModel({
            defaults : {
                border : true,
                sortable : false,
            },
            columns : [ sm, {
                header : OpenLayers.i18n('cadastrapp.duc.compte'),
                dataIndex : 'dnupro'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.nom'),
                dataIndex : 'dnomlp'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.prenom'),
                dataIndex : 'dprnlp'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.mentioncpl'),
                dataIndex : 'epxnee'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.nomcpl'),
                dataIndex : 'dnomcp'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.prenomcpl'),
                dataIndex : 'dprncp'
            }, {
                // TODO : adresse doit etre la concatenation de dlign1..4
                header : OpenLayers.i18n('cadastrapp.duc.adresse'),
                dataIndex : 'dlign1'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.datenaissance'),
                dataIndex : 'jdatnss'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.lieunaissance'),
                dataIndex : 'dldnss'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.cco_lib'),
                dataIndex : 'ccodro_lib'
            } ]
        }),

    });

    // ONGLET 3

    FiucBatimentsStore = new Ext.data.ArrayStore({
        fields : [ {
            name : 'batiment_niveau'
        }, {
            name : 'batiment_porte'
        }, {
            name : 'batiment_type'
        }, {
            name : 'batiment_date'
        }, {
            name : 'batiment_revenu'
        }, {
            name : 'compte'
        }, {
            name : 'nom'
        }, {
            name : 'prenom'
        } ],
    });
    
    var batimentsList = [];
    for (var i=1; i<= 3 ; i++){
        batimentsList.push("A"+i);
    }
    //var batimentsList = ["A1","A2","A3"];
    var buttonBatimentList = [];
    
    for ( var i=0; i< batimentsList.length ; i++ ) {
        console.log('batiment : ' + batimentsList[i]);
        var buttonBatiment = new Ext.Button({
            id:batimentsList[i],
            text : batimentsList[i],
            margins :'0 10 0 10',
            handler : function (e){ reloadBatimentStore(e.text); }
        });
        buttonBatimentList.push(buttonBatiment);

    }

    var FiucBatimentsGrid = new Ext.grid.GridPanel({
        store : FiucBatimentsStore,
        stateful : true,
        height : 500,
        title : 'batiment(s)',
        name : 'Fiuc_Batiments',
        xtype : 'editorgrid',
        colModel : new Ext.grid.ColumnModel({
            defaults : {
                sortable : false,
            },
            columns : [ {

                header : '',
                // selModel: sm,
                width : 50,
                dataIndex : 'col1'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.batiment_niveau'),
                dataIndex : 'batiment_niveau'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.batiment_porte'),
                dataIndex : 'batiment_porte'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.batiment_type'),
                dataIndex : 'batiment_type'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.batiment_date'),
                dataIndex : 'batiment_date'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.batiment_revenu'),
                dataIndex : 'batiment_revenu'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.compte'),
                dataIndex : 'compte'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.nom'),
                dataIndex : 'nom'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.prenom'),
                dataIndex : 'prenom'

            } ]
        })
    });

    // ONGLET 4
 /*   var FiucSubdivfiscData = [ [ 'Lettre indicative', '067AP' ],
            [ 'Contenance', '067AP' ], [ 'Nature de culture', '067AP' ],
            [ 'Revenu au 01-01', '067AP' ] ];*/
    var FiucSubdivfiscData = [ "proprietaire1", "proprietaire1", "ano", "proprietaire1"];
    var FiucSubdivfiscStore = new Ext.data.ArrayStore({
        fields : [ {
            name : 'lettreindic'
        }, {
            name : 'contenance'
        }, {
            name : 'terrain'
        }, {
            name : 'revenu'
        } ],
        data : FiucSubdivfiscData
    });
    
    var FiucSubdivfiscGrid = new Ext.grid.GridPanel({
        store : FiucSubdivfiscStore,
        stateful : true,
        height : 500,
        name : 'Fiuc_Subdivisions_fiscales',
        xtype : 'editorgrid',
        colModel : new Ext.grid.ColumnModel({
            defaults : {
                sortable : false,
            },
            columns : [ {
                header : OpenLayers.i18n('cadastrapp.duc.lettreindic'),
                dataIndex : 'lettreindic'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.contenance'),
                dataIndex : 'contenance'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.terrain'),
                dataIndex : 'terrain'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.revenu'),
                dataIndex : 'revenu'
            } ]
        }),

    });

    // ONGLET 5
    var FiucHistomutData = [ [ 'Date acte', '067AP' ],
            [ 'Référence de la parcelle mére', '067AP' ],
            [ 'Type de mutation', '067AP' ] ];

    var FiucHistomutStore = new Ext.data.ArrayStore({
        fields : [ {
            name : 'dateacte'
        }, {
            name : 'reference.parcelle'
        }, {
            name : 'type.mutation'
        } ],
        data : FiucHistomutData
    });

    var FiucHistomutGrid = new Ext.grid.GridPanel({
        store : FiucHistomutStore,
        stateful : true,
        height : 500,
        name : 'Fiuc_Historique_Mutation',
        xtype : 'editorgrid',
        colModel : new Ext.grid.ColumnModel({
            defaults : {
                sortable : false,
            },
            columns : [ {
                header : OpenLayers.i18n('cadastrapp.duc.dateacte'),
                dataIndex : 'dateacte'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.reference_parcelle'),
                dataIndex : 'reference.parcelle'
            }, {
                header : OpenLayers.i18n('cadastrapp.duc.type_mutation'),
                dataIndex : 'type.mutation'
            } ]
        }),

    });

    // FiucReleveCadastralPdfButton = new Ext.Button({
    // name : 'FiucReleveCadastralPdfButton',
    // cls : "pdf_button"
    //        
    // });
    // 
    // FiucReleveDeProprietePdfButton = new Ext.Button({
    // name : 'FiucReleveDeProprietePdfButton',
    // cls : "pdf_button",
    // text : OpenLayers.i18n("cadastrapp.duc.releve.depropriete")
    // });

    // Construction de la fenêtre principale
    var windowFIUC;
    windowFIUC = new Ext.Window({
        title : 'TODO',
        frame : true,
        autoScroll : true,
        minimizable : false,
        closable : true,
        resizable : false,
        draggable : true,
        constrainHeader : true,

        border : false,
        labelWidth : 400,
        width : 850,
        defaults : {
            autoHeight : true,
            bodyStyle : 'padding:10px',
            flex : 1
        },

        listeners : {
            close : function(window) {
				// AJOUT HAMZA
				var feature = getFeatureById(parcellId);
				setState(feature, "1");
				// FIN AJOUT	
                windowFIUC = null;
            }
        },

        items : [ {
            //autoHeight : true,
            xtype : 'tabpanel',
            width : 800,
            height : 800,
            activeTab : 0,
            items : [
                    {
                        // ONGLET 1
                        title : OpenLayers.i18n('cadastrapp.duc.parcelle'),
                        xtype : 'form',
                        items : [ parcelleDownloadPdfButton , FiucParcelleGrid ]
                    },
                    {
                        // ONGLET 2
                        title : OpenLayers.i18n('cadastrapp.duc.propietaire'),
                        xtype : 'form',
                        items : [ proprietaireDownloadPdfButton,
                                FiucProprietairesGrid ]
                    }, {
                        // ONGLET 3
                        title : OpenLayers.i18n('cadastrapp.duc.batiment'),
                        xtype : 'form',
                        items : [ 
                                  { 
                                      xtype: 'buttongroup', 
                                      frame : false,
                                      items : buttonBatimentList
                                    },
                                   FiucBatimentsGrid ]
                    }, {
                        // ONGLET 4
                        title : OpenLayers.i18n('cadastrapp.duc.subdiv'),
                        xtype : 'form',
                        items : [ FiucSubdivfiscGrid ]

                    }, {
                        // ONGLET 5
                        title : OpenLayers.i18n('cadastrapp.duc.histomut'),
                        xtype : 'form',
                        items : [ FiucHistomutGrid, // grille "historique de
                                                    // mutation"
                        ]
                    } ]
        } ]

    });
    windowFIUC.show();
    console.log("displayFIUC onClick")
}

// return checked rows on proprietaie grid
function getSelectedProprietaire() {
    var proprietaireSelected = grid.getSelectionModel().getSelections();
    console.log(proprietaireSelected);

}

// TODO mettre ca sur utils

function reloadBatimentStore(bat) {
    console.log( bat);
    var FiucBatiments1Data = [
            [ '1', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ],
            [ '1', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ],
            [ '1', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ],
            [ '1', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ],
            [ '1', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ],
            [ '1', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ],
            [ '1', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ] ];
    var FiucBatiments2Data = [
            [ '2', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ],
            [ '2', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ],
            [ '2', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ],
            [ '2', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ],
            [ '2', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ],
            [ '2', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ],
            [ '2', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ] ];
    var FiucBatiments3Data = [
            [ '3', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ],
            [ '3', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ],
            [ '3', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ],
            [ '3', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ],
            [ '3', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ],
            [ '3', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ],
            [ '3', 'APP', '01/01/2014', '852', 'R0026', 'DUPOND', 'PRENOM' ] ];
    
    var Data = []; 
    if (bat == "A1") {
        Data = FiucBatiments1Data;
    } else if(bat == "A2") {
        Data = FiucBatiments2Data;
    } else if(bat == "A3") {
        Data = FiucBatiments3Data;
    }
    FiucBatimentsStore.loadData(Data);
}

function loadBorderauParcellaire() {

    console.log("download borderau function");
    // TODO
    // onClickPrintBordereauParcellaireWindow(parcellId);
}
