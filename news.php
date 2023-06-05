<?php
/**
 * @package WordPress
 * @subpackage Default_Theme
 */
/*
Template Name: Blog
*/
?>
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta http-equiv="Content-Style-Type" content="text/css" />

  <title> Oz Inc </title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
<link href="/styles/oz_style_test.css" rel="Stylesheet" type="text/css" media="all"/>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.15.0/umd/popper.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.min.js"></script>
  <script src="/scripts/jquery-1.3.2.min.js" type="text/javascript"></script>
  <script src="/scripts/jquery.easing.1.3.js" type="text/javascript"></script>
  <script src="/scripts/swfobject.js" type="text/javascript"></script>
  <script src="/scripts/jquery.media.js" type="text/javascript"></script>
  <script src="/scripts/layout_fixers.js" type="text/javascript"></script>
  <script src="/scripts/utility.js" type="text/javascript"></script>
  <script src="/scripts/runes.js" type="text/javascript"></script>
  <script src="/scripts/control.js" type="text/javascript"></script>  
  <script src="/scripts/oz_script.js" type="text/javascript"></script>
  
  <script src="/scripts/oz_intro.js" type="text/javascript"></script>
  
</head>

<body>

<!-- START: header content -->
<div id="header">
<h1>  Oz Incorporated 
<a href="/" title="Oz Incorporated"> 
<img src="/images/logo.png" alt="Oz Incorporated Logo" /> 
</a>
</h1>
<!-- account navigation -->
 <div class="main_div">
    <nav id="main_nav" class="navbar fixed-top navbar-expand-lg navbar-light bg-light display-6">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
			<li class="nav-item">
            <a class="nav-link" href="/index.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/the_farm.html">The Farm</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/our_team.html">Our Team</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/blog">News &amp; Results</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/horse_care.html">Horse Care &amp; Training</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/portfolio.html">Portfolio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/blog/?page_id=214">Sales Horses</a>
          </li>
        </ul>
      </div>
    </nav>
<!-- END: header content -->
<div class="tri_wrap_middle"> <div class="tri_wrap_upper"> <div class="tri_wrap_lower">
<h2 class="blog_title"> <a href="/blog"> OZ Blog </a> </h2>
<img class="hr" src="/images/icons/hr_fancy.gif" alt="hr" />

	<div id="content" class="" role="main">

	<?php if (have_posts()) : ?>

		<?php while (have_posts()) : the_post(); ?>

			<div <?php post_class() ?> id="post-<?php the_ID(); ?>">
				<h3><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>"><?php the_title(); ?></a></h3>
				<h6 class="post_meta"><?php the_time('F jS, Y') ?> &mdash;  by: <?php the_author() ?> </h6>

				<div class="entry">
					<?php the_content('Read the rest of this entry &raquo;'); ?>
				</div>

				<p class="postmetadata"><?php the_tags('Tags: ', ', ', '<br />'); ?> Posted in <?php the_category(', ') ?></p>
				<p class="postmetadata"> <?php comments_popup_link('Post a Comment', 'Post a Comment  [1]', 'Post a Comment [%]'); ?></p>
			</div>
		<?php endwhile; ?>

		<div class="navigation">
			<div class="alignleft"><?php next_posts_link('&laquo; Older Entries') ?></div>
			<div class="alignright"><?php previous_posts_link('Newer Entries &raquo;') ?></div>
		</div>
	<?php else : ?>

		<h2 class="center">Not Found</h2>
		<p class="center">Sorry, but you are looking for something that isn't here.</p>
		<?php get_search_form(); ?>

	<?php endif; ?>

	</div>

<?php get_sidebar(); ?>

<?php get_footer(); ?>
