<template>
  <div>
    <Navbar />
    <!-- The button to open modal -->
    <label
      for="profile-popup"
      class="btn btn-outline btn-accent text-white font-bold modal-button"
      >Profile</label
    >

    <!-- Put this part before </body> tag -->
    <input type="checkbox" id="profile-popup" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box relative">
        <label
          for="profile-popup"
          class="btn btn-sm btn-circle absolute right-2 top-2"
          >✕</label
        >

        <p class="py-4">{{ $store.state.authUser }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage',
}
</script>
