import $ from 'jquery';

export const ajax = ( options, resolve, reject ) => $.ajax( options )
	.done( resolve )
	.fail( reject );
