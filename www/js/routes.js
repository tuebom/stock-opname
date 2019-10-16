routes = [
  {
    path: '/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      app.request.getJSON( app.data.endpoint + 'dashboard', function(res) {

        // Hide Preloader
        app.preloader.hide();

        // console.log(res)
        // var data = JSON.parse(res)
        
        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/home.html',
          },
          {
            context: {
              banner: res.banner,
              data: res.categories,
            }
          }
        );

      });
    },
  },
  // {
  //   path: '/login/',
  //   componentUrl: './pages/login.html',
  // },
  {
    path: '/stock-opname/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      // var router = this;

      // App instance
      // var app = router.app;

      // Resolve route to load page
      resolve(
        {
          componentUrl: './pages/stock-opname.html',
        }
      );
    },
  },
  {
    path: '/cek-resi/:nomor',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;
      var order_id = routeTo.params.nomor;

      // Show Preloader
      app.preloader.show();

      app.request.getJSON( app.data.endpoint + 'resi/'+order_id, function(res) {

        app.preloader.hide();

        resolve (
          { componentUrl: './pages/cek-resi.html' },
          { context: { data: res } }
        );
      });
    }
  },
  {
    path: '/settings/',
    url: './pages/settings.html',
  },
  {
    path: '/account/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      if (!app.data.bLogedIn) {
        
        app.data.lastURL = '/account/';

        resolve(
          {
            componentUrl: './pages/login.html',
          }
        );
        return;
      }
      
      resolve(
        {
          componentUrl: './pages/account.html',
        }
      );
      return;
    }
  },
  {
    path: '/profile/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      if (!app.data.bLogedIn) {
        
        app.data.lastURL = '/profile/';

        resolve(
          {
            componentUrl: './pages/login.html',
          }
        );
        return;
      }

      // Show Preloader
      app.preloader.show();
        
      app.request.getJSON( app.data.endpoint + 'member/'+app.data.mbrid, function(res) {
          
        // var data = JSON.parse(res);

        resolve (
          { componentUrl: './pages/profile.html' },
          { context: { data: res } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/chat/',
    componentUrl: './pages/chat.html',
  },
  {
    path: '/notifications/',
    componentUrl: './pages/notifications.html',
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];