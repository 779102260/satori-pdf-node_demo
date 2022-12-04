<script setup>
const title = 'OG Image Generator using Nuxt and Satori 222'
const website = 'v3.nuxtjs.org'

const url = `/api/og?title=${title}&website=${website}`
async function getPDF() {
  const data = await fetch(`/api/og?title=${title}&website=${website}`)
  const a = document.createElement('a');
  a.href = URL.createObjectURL(data.body);
  a.download = 'outFileName.pdf';
  a.click();
}
</script>

<template>
  <div>
    <Head>
      <Meta property="og:image" :content="url" />
    </Head>
    <p>111</p>
    <!-- <img :src="url" alt="hello"> -->
    <br/>
    <p @click="getPDF">222</p>
  </div>
</template>
