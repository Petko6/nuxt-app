<template>
  <div class="navbar bg-base-200">
    <div class="flex-1">
      <nuxt-link to="/" class="btn btn-ghost normal-case text-xl"
        >Název</nuxt-link
      >
    </div>
    <div class="flex-none">
      <div v-if="!$store.state.authUser">
        <!-- The button to open modal -->
        <label
          for="login-popup"
          class="btn modal-button btn-accent btn-wide font-bold"
          >Login</label
        >

        <!-- Put this part before </body> tag -->
        <input type="checkbox" id="login-popup" class="modal-toggle" />
        <div class="modal modal-bottom sm:modal-middle">
          <div class="modal-box">
            <label
              for="login-popup"
              class="btn btn-sm btn-square btn-ghost absolute right-2 top-2 text-center"
              >✕</label
            >
            <div class="divider font-bold text-lg text-center">Sign in</div>

            <a class="btn btn-block btn-primary" href="/auth/steam">
              <svg
                class="fill-white"
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22.411 9.681c0 .924-.751 1.676-1.676 1.676-.924 0-1.676-.752-1.676-1.676s.752-1.676 1.676-1.676c.925 0 1.676.752 1.676 1.676zm1.589 0c0 1.801-1.464 3.282-3.303 3.263l-2.872 2.141-.006.002c-.008 1.369-1.111 2.483-2.485 2.496-1.24.01-2.257-.872-2.484-2.021l-8.962-3.769c-.39.256-.854.409-1.354.414-1.398.012-2.521-1.109-2.534-2.486-.014-1.395 1.113-2.534 2.511-2.534 1.213 0 2.228.863 2.459 2.013l8.971 3.772c.416-.272.896-.418 1.428-.407l2.105-2.946c.033-1.773 1.48-3.202 3.262-3.202 1.802 0 3.264 1.461 3.264 3.264zm-20.794 1.826l-1.226-.515c-.716-.301-1.052-1.125-.751-1.84.301-.716 1.125-1.052 1.841-.751l1.211.509c-.303-.678-.984-1.153-1.77-1.153-1.096.004-1.951.895-1.941 1.958.01 1.044.861 1.926 1.958 1.922.236-.002.464-.048.678-.13zm14.045 3.547c-.01-1.06-.88-1.922-1.939-1.922-.229.001-.455.04-.686.127l1.229.517c.716.301 1.052 1.125.751 1.84-.301.715-1.124 1.052-1.841.751l-1.23-.518c.302.685.985 1.165 1.794 1.162 1.072-.009 1.932-.884 1.922-1.957zm5.703-5.373c0-1.224-.995-2.219-2.219-2.219-1.223 0-2.219.995-2.219 2.219 0 1.223.996 2.219 2.219 2.219 1.224 0 2.219-.996 2.219-2.219z"
                />
              </svg>
            </a>
            <div class="modal-action"></div>
          </div>
        </div>
      </div>
      <div v-else class="dropdown dropdown-hover dropdown-end">
        <img
          :src="$store.state.authUser.profile.picture"
          class="rounded-lg self-center btn btn-square btn-outline btn-warning"
        />
        <ul
          tabindex="0"
          class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li class="menu-title">
            <span class="">{{ $store.state.authUser.profile.name }}</span>
          </li>
          <li>
            <nuxt-link
              to="/profile"
              class="btn btn-outline btn-secondary text-white font-bold"
              href=""
              >Profile</nuxt-link
            >
          </li>
          <div class="divider"></div>
          <li>
            <a @click="logout" class="btn btn-accent text-white font-bold">
              <svg
                class="fill-white"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16 12.771h-3.091c-.542 0-.82-.188-1.055-.513l-1.244-1.674-2.029 2.199 1.008 1.562c.347.548.373.922.373 1.42v4.235h-1.962v-3.981c-.016-1.1-1.695-2.143-2.313-1.253l-1.176 1.659c-.261.372-.706.498-1.139.498h-3.372v-1.906l2.532-.001c.397 0 .741-.14.928-.586l1.126-2.75c.196-.41.46-.782.782-1.102l2.625-2.6-.741-.647c-.223-.195-.521-.277-.812-.227l-2.181.381-.342-1.599 2.992-.571c.561-.107 1.042.075 1.461.462l2.882 2.66c.456.414.924 1.136 1.654 2.215.135.199.323.477.766.477h2.328v1.642zm-2.982-5.042c1.02-.195 1.688-1.182 1.493-2.201-.172-.901-.96-1.528-1.845-1.528-1.186 0-2.07 1.078-1.85 2.234.196 1.021 1.181 1.69 2.202 1.495zm4.982-5.729v15l6 5v-20h-6z"
                /></svg
              >Logout</a
            >
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
