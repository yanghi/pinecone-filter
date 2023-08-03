## pinecone-filter

A simple filter builder for [pinecone meta filter](https://www.pinecone.io/docs/metadata-filtering/).

## Usage

```js
var filter = new PineconeFilterBuilder().equal({
  foo: 'foo',
  bar: 'bar'
}).in('num', [1,2,3]).result();

// get filter object
{
  foo: {$eq: 'foo'},
  bar: {$eq: 'bar'},
  num: {$in:[1,2,3]}
}

var otherfilter = PineconeFilterBuilder.from({
  foo: 'foo',
  num: {$gt: 2}
}).in({
  age: [18,19]
}).result();
```

## Typescript type checking

``` ts
type MyFilterKey = 'foo' | 'bar'

var builder = new PineconeFilterBuilder<MyFilterKey>()
//  type checking work well
builder.equal('foo', 'ha')
// get type errors
builder.equal('other', 'ha')
```