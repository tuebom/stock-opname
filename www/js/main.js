// Dom7
var $$ = Dom7;

var items   = [];
// sample data
// [
//   {
//     'kdbar': '01330003',
//     'nama': 'BASIC SHORT APRON BLACK',
//     'hjual': '90.000',
//     'store': '10',
//     'whouse': '20',
//     'gambar': 'https://ik.imagekit.io/aswin/upload/gambar/013300003.webp',
//   },
//   {
//     'kdbar': '01330004',
//     'nama': 'BASIC SHORT APRON MAROON',
//     'hjual': '90.000',
//     'store': '10',
//     'whouse': '20',
//     'gambar': 'https://ik.imagekit.io/aswin/upload/gambar/013300004.png',
//   },
//   {
//     'kdbar': '01330005',
//     'nama': 'BASIC SHORT APRON KHAKY',
//     'hjual': '90.000',
//     'store': '10',
//     'whouse': '20',
//     'gambar': 'https://ik.imagekit.io/aswin/upload/gambar/013300005.png',
//   },
// ];

// var bBackPressed = false;

var app = new Framework7({
  root: '#app',
  id:   'com.askitchen.stockinfo',
  name: 'Stock Info',
  theme: 'md',
  
  init: true, // for calling keepAwake()
  initOnDeviceReady: true,

  // App root data
  data: function () {
    return {
      // db: null,
      // username: null,
      // password: null,

      endpoint: 'https://askitchen.com/api/v1/',

    };
  },
  // App root methods
  methods: {
    
    itemAdd: function(kode) {
      
      if (app.methods.itemExists(kode)) {
        app.dialog.alert('Item barang sudah ada!');
        // $$('.search').val('');
        return;
      }

      app.preloader.show();

      app.request.getJSON( app.data.endpoint + 'stock-info/'+kode, function(res) {
        
        app.preloader.hide();
        
        if (res.data.status) {
                
          items.push({ kdbar: res.data.kdbar,
                          nama: res.data.nama,
                          hjual: res.data.hjual,
                          store: res.data.store,
                          whouse: res.data.whouse,
                          gambar: res.data.gambar });

          // refresh display
          app.router.navigate('/', {
            reloadCurrent: true,
            ignoreCache: true,
          });
        } else
          app.dialog.alert('Item tidak ditemukan!');
      });

    },
    itemExists: function(kode) {
      
      var bFound = false;

      for (var i=0; i < items.length; i++)
        if (items[i].kdbar === kode) {
          
          bFound = true;
          break;
        }
      return bFound;
    },
  },
  on: {

    init: function () { // sama dengan onDeviceReady
      
      //*
      window.plugins.insomnia.keepAwake();
      //*/
    }
  },      
  routes: [
    // Add your routes here
    {
      path: '/',
      async: function (routeTo, routeFrom, resolve, reject) {
        // Router instance
        // var router = this;

        // App instance
        // var app = router.app;

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/home.html',
          }
        );
      },
    },
    {
      path: '/search/',
      componentUrl: './pages/search.html',
    },
  ],
});

var mainView = app.views.create('.view-main', {
  url: '/'
});

$$(document).on('backbutton', function (e) {

  e.preventDefault();
  
  var dialog = app.dialog.prompt('Input password..', function (pwd) {
    
    if (pwd == '123') {
  
      window.plugins.insomnia.allowSleepAgain();
      navigator.app.exitApp();
    }
  });
  dialog.$el.find('input').focus();
});
