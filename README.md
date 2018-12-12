# Colour Me Cards

Colour Me Cards are your classic holiday cards, with a modern twist.

It's a black and white printed greeting card that comes in 4 different designs. The front of the card has original line-art, to be used as a colouring activity. The back of the card has a QR code and URL, leading to an interactive game inspired by the front. The inside of the card includes a cute message relating to the card design.

See the website in action: http://colourmecards.com

## Offline component

There are four ready-to-print PDFs, inside print.zip or the print directory, in the public directory. Each pdf file makes two cards, after being cut in the middle. Print the pdf double sided, so the messages are on the inside of the card. You can print them at home, or send them to a printing service like Staples. 

## Online component

Make sure you have node installed, and then:

```
$ git clone https://github.com/ellailan/ColourMeCards.git
$ npm install
$ npm start 
```

## Customization

### Modifying the cards for a different domain

There are MS Word files, in the print directory. Create a new QR code (with a tool such as https://www.qr-code-generator.com/) and put in in place of the current one. Change the URL. There are two cards on each page, so make sure to change both of them. Be careful, editing Word documents can be tricky.

## About the project

This is my 7th grade Power Play Young Entrepreneur project. I designed the cards with Scratch, and wrote the code with BlockLike. I sold each card for 50¢, and 4 for $1.50.

## Made with

https://scratch.mit.edu 
https://www.blocklike.org
https://www.heroku.com

## Credits

All art by Ella Ilan
Front end code by Ella Ilan and Liam Ilan
Back end code by Liam Ilan
Music by Liam Ilan

## Licence

MIT
