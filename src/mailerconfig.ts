//import { HandlebarsAdapter } from '@nest-modules/mailer';

export = {
  transport: `smtp://admin123:qwerty@localhost:2500`,
  defaults: {
    from: 'admin@test.example.com',
  },
  template: {
    dir: './templates/email',
    //adapter: new HandlebarsAdapter(), // musimy mu podać z jakiego systemu szablonu będziemy korzystali, musimy coś wskazać więc wpisujemy HandlebarsAdapter
    options: {
      strict: true,
    },
  },
};
