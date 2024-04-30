# Generic-Advanced-Form

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Description

this compoenent is a angular dev ui component that's name 'Advanced Form' but it'll be a generic one and you can call them in your modules or component angular with just some additional arguments 

## Arguments

- config : this table contain the config of each label you wanna print it or manage it on the advanced form
- data : this is the displayed data
- modalData : this is the component that you wanna show it when click in some preview cell type 
- receiveDataFromChild($event) : this is an output to send from the generic advanced to the original compoenent (where you call the generic)

## Installation

- clone it in your shared angular folder or in your desktop then copy paste to the shared to ignore opening 2 gits in your project.
- on your global module/module.ts you should import the generic advanced form module (in case of your app module is for the authentification then import it into the sub global module of app module , exemple: pages module)
- call the genric form by : " <da-advance-form-generic [cols]="config" [listData]="data" [modalData]="modalData ? modalData:null" (dataEvent)="receiveDataFromChild($event)">
    </da-advance-form-generic>"
- prepare the arguments on your component.ts by calling the config and data from the responsable service : for exemple if your component for merchants then you'll prepare the config of merchant and the data (get it from backend api or whatever)
- you can start working with it

## Usage

[Explain how to use your project. Provide code examples or a quick start guide if applicable.]

## Contributing

[Explain how others can contribute to your project. This could include guidelines for submitting bug reports, feature requests, or code contributions.]

## License

[Specify the license under which your project is distributed. Common choices include MIT, Apache, and GPL. Include a link to the full license text.]

## Credits

[List any contributors or resources that helped inspire or create your project.]

## Support

[Provide information on how users can get help with your project. This could include links to documentation, FAQs, or community forums.]

## Acknowledgements

[Optional section to thank individuals or organizations that have contributed to your project.]

