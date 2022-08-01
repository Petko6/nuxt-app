<template>
  <div class="navbar bg-base-200">
    <div class="flex-1">
      <a class="btn btn-ghost normal-case text-xl">daisyUI</a>
    </div>
    <div class="flex-none">
      <a
        v-if="!$store.state.authUser"
        class="btn btn-wide btn-primary"
        href="/auth/steam"
      >
        Sign in with Steam
      </a>
      <div v-else class="dropdown dropdown-hover dropdown-end">
        <label tabindex="0" class="btn btn-square rounded-lg">
          <img
            :src="$store.state.authUser.profile.picture"
            class="rounded-lg"
          />
        </label>
        <ul
          tabindex="0"
          class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li class="menu-title">
            <span>{{ $store.state.authUser.profile.name }}</span>
          </li>
          <li>
            <a @click="logout" class="bg-accent text-white font-bold">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    async logout() {
      try {
        await this.$store.dispatch('logout')
      } catch (e) {
        this.formError = e.message
      }
    },
  },
}
</script>
