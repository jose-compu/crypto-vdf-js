/*
 * Generate a 4096-bit VDF discriminant: D = -p where p is probable-prime,
 * p ≡ 7 (mod 8), bit length exactly 4096. Uses OpenSSL BN (fast native MR).
 *
 * Build & run:
 *   cc -O3 -o /tmp/gen4096 scripts/generate-precomputed-4096.c \
 *      $(pkg-config --cflags --libs libcrypto) \
 *      -I"$(brew --prefix openssl)/include" \
 *      -L"$(brew --prefix openssl)/lib" -lcrypto
 *   /tmp/gen4096 > /tmp/d4096.txt
 *
 * Or: npm run generate:4096
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <openssl/bn.h>
#include <openssl/err.h>

#define BITS 4096
#define MR_CHECKS 64

static void die_openssl(const char *msg) {
  fprintf(stderr, "%s\n", msg);
  ERR_print_errors_fp(stderr);
  exit(1);
}

int main(void) {
  clock_t t0 = clock();
  BN_CTX *ctx = BN_CTX_new();
  BIGNUM *p = BN_new();
  BIGNUM *eight = BN_new();
  BIGNUM *seven = BN_new();
  BIGNUM *rem = BN_new();
  BIGNUM *one = BN_new();
  if (!ctx || !p || !eight || !seven || !rem || !one) {
    die_openssl("BN alloc failed");
  }
  BN_set_word(eight, 8);
  BN_set_word(seven, 7);
  BN_one(one);

  /* Random 4096-bit candidate with top bit set, then force ≡ 7 mod 8 */
  if (!BN_rand(p, BITS, BN_RAND_TOP_ONE, BN_RAND_BOTTOM_ODD)) {
    die_openssl("BN_rand failed");
  }
  if (!BN_mod(rem, p, eight, ctx)) {
    die_openssl("BN_mod failed");
  }
  /* p := p - (p mod 8) + 7 */
  if (!BN_sub(p, p, rem) || !BN_add(p, p, seven)) {
    die_openssl("adjust mod 8 failed");
  }
  /* Ensure still BITS bits (if underflow, add 8 repeatedly until top bit set) */
  while (BN_num_bits(p) < BITS) {
    if (!BN_add(p, p, eight)) die_openssl("BN_add");
  }
  while (BN_num_bits(p) > BITS) {
    if (!BN_sub(p, p, eight)) die_openssl("BN_sub");
  }

  unsigned long tries = 0;
  for (;;) {
    tries++;
    if ((tries % 25) == 0) {
      fprintf(stderr, "… tried %lu candidates (%.1fs)\n", tries,
              (double)(clock() - t0) / CLOCKS_PER_SEC);
    }
    int is_prime = BN_is_prime_ex(p, MR_CHECKS, ctx, NULL);
    if (is_prime < 0) die_openssl("BN_is_prime_ex failed");
    if (is_prime == 1) {
      /* Validate */
      if (BN_num_bits(p) != BITS) {
        fprintf(stderr, "unexpected bit length %d\n", BN_num_bits(p));
        exit(1);
      }
      if (!BN_mod(rem, p, eight, ctx) || BN_cmp(rem, seven) != 0) {
        fprintf(stderr, "mod 8 check failed\n");
        exit(1);
      }
      /* D = -p as decimal for TypeScript bigint literal */
      char *dec = BN_bn2dec(p);
      if (!dec) die_openssl("BN_bn2dec failed");
      fprintf(stderr, "OK tries=%lu elapsed=%.2fs bits=%d\n", tries,
              (double)(clock() - t0) / CLOCKS_PER_SEC, BN_num_bits(p));
      /* stdout: negative decimal only */
      printf("-%s\n", dec);
      OPENSSL_free(dec);
      break;
    }
    if (!BN_add(p, p, eight)) die_openssl("BN_add step");
    if (BN_num_bits(p) > BITS) {
      /* wrap: clear high overflow by subtracting 2^(BITS-1) style — re-rand */
      if (!BN_rand(p, BITS, BN_RAND_TOP_ONE, BN_RAND_BOTTOM_ODD)) {
        die_openssl("BN_rand failed");
      }
      if (!BN_mod(rem, p, eight, ctx)) die_openssl("BN_mod");
      if (!BN_sub(p, p, rem) || !BN_add(p, p, seven)) die_openssl("re-adjust");
    }
  }

  BN_free(p);
  BN_free(eight);
  BN_free(seven);
  BN_free(rem);
  BN_free(one);
  BN_CTX_free(ctx);
  return 0;
}
