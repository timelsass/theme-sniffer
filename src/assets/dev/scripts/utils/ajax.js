import $ from 'jquery';

export default function ajax( options ) {
	return new Promise( ( resolve, reject ) => {
		$.ajax( options ).done( resolve ).fail( reject );
	});
}
