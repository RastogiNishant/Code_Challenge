// Provide 3 unique implementations of the following function in JavaScript.

// **Input**: `n` - any integer

// *Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`*.

// ** Output **: `return` - summation to`n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.

var sum_to_n_a = function (n) {
	return Array.from({ length: n }, (_, i) => i + 1).reduce(
		(acc, curr) => acc + curr,
		0,
	);
};

var sum_to_n_b = function (n) {
	return (n * (n + 1)) / 2;
};

var sum_to_n_c = function (n) {
	if (n <= 0) return 0;
	return n + sum_to_n_c(n - 1);
};

var sum_to_n_d = function (n) {
	let sum = 0;
	let i = 1;
	while (i <= n) {
		sum += i;
		i++;
	}
	return sum;
};

var sum_to_n_e = function (n) {
	let sum = 0;
	let count = n;
	do {
		sum += count;
	} while (--count > 0);
	return sum;
};

console.log(sum_to_n_a(-1));
console.log(sum_to_n_b(5));
console.log(sum_to_n_c(15));
console.log(sum_to_n_d(15));
console.log(sum_to_n_e(15));
