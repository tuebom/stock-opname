// Dom7
var $$ = Dom7;

var items   = [];
// sample data
// [
//   {
//     'kdbar': '01330003',
//     'gambar': 'https://ik.imagekit.io/aswin/upload/gambar/013300003.webp',
//   },
//   {
//     'kdbar': '01330004',
//     'gambar': 'https://ik.imagekit.io/aswin/upload/gambar/013300004.png',
//   },
//   {
//     'kdbar': '01330005',
//     'gambar': 'https://ik.imagekit.io/aswin/upload/gambar/013300005.png',
//   },
// ];

// var bBackPressed = false;

var app = new Framework7({
  root: '#app',
  id:   'com.askitchen.stockopname',
  name: 'Stock Opname',
  
  init: true, // for calling keepAwake()
  initOnDeviceReady: true,

  // App root data
  data: function () {
    return {
      // db: null,
      user: null,
      password: null,
      whouse: null,

      code: null,
      name: null,
      brand: null,
      image: null,
      sysqty: 0,
      
      currentDate: null,
      bLogedIn: false,

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

      app.request.getJSON( app.data.endpoint + 'stock-opname/'+kode, function(res) {
        
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
      
      /*
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


// Login Screen
$$('#my-login-screen .login-button').on('click', function () {
  
  var user = $$('#my-login-screen [name="usr"]').val();
  if (user == '') {
      app.dialog.alert('Masukkan data user.', 'Login User');
      return;
  }

  var password = $$('#my-login-screen [name="pwd"]').val();
  if (password == '') {
      app.dialog.alert('Masukkan password.', 'Login User');
      return;
  }

  var whouse = $$('#my-login-screen [name="whouse"]')[0].selectedOptions[0].text;
  if (whouse == '') {
      app.dialog.alert('Pilih warehouse.', 'Login User');
      return;
  }
  
  app.preloader.show();

  var formData = app.form.convertToData('.login-form');

  
  app.request.post('https://apgroup.id/api/method/login', formData, function (res) {
    
    app.preloader.hide();
    
    // console.log(res)
    var data = JSON.parse(res);

    if (data.message == 'Logged In') {
      // console.log('Active user: '+ data.full_name)
    
      localStorage.setItem('email', user);
      // localStorage.setItem('password', password);
      // console.log('Current user: '+user)

      app.loginScreen.close('#my-login-screen');
      
      app.data.bLogedIn = true;
      app.data.user     = data.full_name;
      app.data.password = password;
      app.data.whouse   = whouse;
      // app.data.token = data.token;

      console.log("app.data.whouse: "+app.data.whouse)
      
      // display driver name
      // $$('.member-name').text(data.full_name);

      // kosongkan isian nomor pin
      $$('#my-login-screen [name="pwd"]').val('');
      
      app.router.navigate('/', {
        reloadCurrent: true,
        ignoreCache: true,
      });
    }
  },
  function (xhr, status) {
    
    app.preloader.hide();
    app.dialog.alert('Invalid user!', 'Login User');
  });
});


$$('#my-login-screen').on('loginscreen:opened', function (e, loginScreen) {
  // set data ke form login
  $$('#my-login-screen [name="usr"]').val(localStorage.getItem('email'));
  // console.log('Login screen open')
  // console.log('Current user: '+localStorage.getItem('email'))
});


app.on('pageInit', function (page) {

  $$('input').on('focus', function () {
    
    $$('.kb').css('height', '280px');
    //var limit = $$(window).height() - 280;

    if ($$(this).offset().top > 280) {
      $$('.page-content').scrollTop($$(this).offset().top-168);
    }
  });

  $$('input').on('blur', function () {
    $$('.kb').css('height', '0px');
  });
});


$$(document).on('backbutton', function (e) {

  e.preventDefault();
  
  var dialog = app.dialog.prompt('Input password..', function (pwd) {
    
    if (pwd == '123') {
  
      // window.plugins.insomnia.allowSleepAgain();
      navigator.app.exitApp();
    }
  });
  dialog.$el.find('input').focus();
});
