<template>
  <v-avatar
    color="accent"
    size="28"
  >
    <v-avatar
      color="white"
      size="26"
    >
      <span class="overline accent--text">{{ locale }}</span>
    </v-avatar>
  </v-avatar>
</template>
<script>
export default {
    name: "LanguageIcon",
    props: {
        locale: {
            type: String,
            required: true
        }
    }
};
</script>
