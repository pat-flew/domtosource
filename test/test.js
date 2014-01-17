var fs = require('fs'),
	domtosource = require('../'),
	assert = require('assert');

describe('domtosource', function() {

	describe('Test bad inputs', function() {

		it('should throw an error if the html is empty', function() {
			assert.throws(function() {
				var results = domtosource.find('', '.green', true);
			});
		});

		it('should throw an error if the selector is empty', function() {
			assert.throws(function() {
				var doc = fs.readFileSync(__dirname + '/example-html/page1.html', 'utf8'),
				results = domtosource.find(doc, '', true);
			});
		});
	});

	describe('Test .green', function() {

		var doc = fs.readFileSync(__dirname + '/example-html/page1.html', 'utf8'),
			results = domtosource.find(doc, '.green', true);

		it('should return 4 results', function() {
			assert.equal(4, results.length);
		});

		it('should be able to use method A (the fast method) for unique elements', function() {
			assert.equal(results[0].calculationMethod, 'methodA');
			assert.equal(results[1].calculationMethod, 'methodA');
			assert.equal(results[2].calculationMethod, 'methodB');
			assert.equal(results[3].calculationMethod, 'methodB');
		});

		it('should calculate line and column numbers correctly', function() {
			assert.equal(results[0].line, 12);
			assert.equal(results[1].line, 12);
			assert.equal(results[2].line, 16);
			assert.equal(results[3].line, 17);
			assert.equal(results[0].column, 5);
			assert.equal(results[1].column, 29);
			assert.equal(results[2].column, 5);
			assert.equal(results[3].column, 5);
		});
	});

	describe('Test a document with no line breaks', function() {
		var doc = fs.readFileSync(__dirname + '/example-html/page1-oneline.html', 'utf8'),
			results = domtosource.find(doc, '.green', true);

		it('should return 4 results', function() {
			assert.equal(4, results.length);
		});

		it('should be able to use method A (the fast method) for unique elements', function() {
			assert.equal(results[0].calculationMethod, 'methodA');
			assert.equal(results[1].calculationMethod, 'methodA');
			assert.equal(results[2].calculationMethod, 'methodB');
			assert.equal(results[3].calculationMethod, 'methodB');
		});

		it('should calculate line and column numbers correctly', function() {
			assert.equal(results[0].line, 1);
			assert.equal(results[1].line, 1);
			assert.equal(results[2].line, 1);
			assert.equal(results[3].line, 1);
			assert.equal(results[0].column, 199);
			assert.equal(results[1].column, 223);
			assert.equal(results[2].column, 316);
			assert.equal(results[3].column, 348);
		});
	});

	describe('Test a large document', function() {
		var doc = fs.readFileSync(__dirname + '/example-html/css3-selectors.html', 'utf8'),
			results = domtosource.find(doc, 'p', true),
			results2 = domtosource.find(doc, 'p[class]', true);

		it('should return 333 results', function() {
			assert.equal(results.length, 333);
		});

		it('should return 16 results for paragraphs with a class attribute', function() {
			assert.equal(results2.length, 16);
		});
	});

	// Test method B and capitalised element names
	describe('Test a document with some capitalised element names', function() {
		var doc = fs.readFileSync(__dirname + '/example-html/page1-caps.html', 'utf8'),
			results = domtosource.find(doc, '.green', true);

		it('should be able to use method A (the fast method) for unique elements', function() {
			assert.equal(results[0].calculationMethod, 'methodA');
			assert.equal(results[1].calculationMethod, 'methodA');
			assert.equal(results[2].calculationMethod, 'methodB');
			assert.equal(results[3].calculationMethod, 'methodB');
		});

		it('should calculate line and column numbers correctly', function() {
			assert.equal(results[0].line, 12);
			assert.equal(results[1].line, 12);
			assert.equal(results[2].line, 16);
			assert.equal(results[3].line, 17);
			assert.equal(results[0].column, 5);
			assert.equal(results[1].column, 29);
			assert.equal(results[2].column, 5);
			assert.equal(results[3].column, 5);
		});

		it('should return HTML for each result', function() {
			assert.equal(results[0].html, '<li class="green">Green <span class="green">test</span></li>');
			assert.equal(results[1].html, '<span class="green">test</span>');
			assert.equal(results[2].html, '<LI class="green">Green</LI>');
			assert.equal(results[3].html, '<LI class="green">Green</LI>');
		});
	});

	describe('Test a document with nested list items', function() {
		var doc = fs.readFileSync(__dirname + '/example-html/nested-lists.html', 'utf-8'),
			results = domtosource.find(doc, 'li li', true);

		it('should process descendent selectors correctly', function() {
			assert(results.length, 10)
		});
	});

	describe('Test ambiguous elements', function() {
		var doc = fs.readFileSync(__dirname + '/example-html/ambiguous-elements.html', 'utf-8'),
			results = domtosource.find(doc, 'li', true);

		it('should be able to distinguish between list and li elements when calculating line numbers', function() {
			assert.equal(results[0].line, 7);
			assert.equal(results[1].line, 8);
			assert.equal(results[2].line, 9);
			assert.equal(results[3].line, 10);
		});
	});

	describe('Test ignore elements inside comments', function() {
		var doc = fs.readFileSync(__dirname + '/example-html/ignore-comments.html', 'utf-8'),
			results = domtosource.find(doc, 'li', true);

		it('should not match elements inside html comments when calculating line numbers', function() {
			assert.equal(results[0].line, 12);
			assert.equal(results[1].line, 13);
			assert.equal(results[2].line, 14);
			assert.equal(results[3].line, 15);
		});
	});
});
