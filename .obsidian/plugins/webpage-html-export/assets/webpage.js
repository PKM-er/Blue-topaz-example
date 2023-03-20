jQuery(function()
{
    // THEME TOGGLE

	// load saved theme state
    if (localStorage.getItem("theme_toggle") != null)
    {
        setThemeToggle(localStorage.getItem("theme_toggle") == "true");
    }

	var lastScheme = "theme-dark";
	// change theme to match current system theme
	if (localStorage.getItem("theme_toggle") == null && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
	{
		setThemeToggle(true);
		lastScheme = "theme-light";
	}
	if (localStorage.getItem("theme_toggle") == null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
	{
		setThemeToggle(true);
		lastScheme = "theme-dark";
	}

	// set initial toggle state based on body theme class
	if ($("body").hasClass("theme-light"))
	{
		setThemeToggle(true);
	}
	else
	{
		setThemeToggle(false);
	}

	function setThemeToggle(state, instant = false)
	{
		$(".toggle__input").each(function()
		{
			$(this).prop("checked", state);
		});

		if(!$(".toggle__input").hasClass("is-checked") && state)
		{
			$(".toggle__input").addClass("is-checked");
		}
		else if ($(".toggle__input").hasClass("is-checked") && !state)
		{
			$(".toggle__input").removeClass("is-checked");
		}

		if(!state)
		{
			if ($("body").hasClass("theme-light"))
			{
				$("body").removeClass("theme-light");
			}

			if (!$("body").hasClass("theme-dark"))
			{
				$("body").addClass("theme-dark");
			}
		}
		else
		{
			if ($("body").hasClass("theme-dark"))
			{
				$("body").removeClass("theme-dark");
			}

			if (!$("body").hasClass("theme-light"))
			{
				$("body").addClass("theme-light");
			}
		}

		localStorage.setItem("theme_toggle", state ? "true" : "false");
	}

    $(".toggle__input").on("click", function()
    {
		setThemeToggle(!(localStorage.getItem("theme_toggle") == "true"));
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => 
	{
		// return if we are printing
		if (window.matchMedia('print').matches)
		{
			printing = true;
			return;
		}

        let newColorScheme = event.matches ? "theme-dark" : "theme-light";

		if (newColorScheme == lastScheme) return;

        if (newColorScheme == "theme-dark")
        {
			setThemeToggle(false);
        }

        if (newColorScheme == "theme-light")
        {
			setThemeToggle(true);
        }

		lastScheme = newColorScheme;
    });

    // MAKE CALLOUTS COLLAPSIBLE
    // if the callout title is clicked, toggle the display of .callout-content
    $(".callout.is-collapsible .callout-title").on("click", function()
    {
        var isCollapsed = $(this).parent().hasClass("is-collapsed");

        if (isCollapsed)
        {
            $(this).parent().toggleClass("is-collapsed");
        }

        $(this).parent().find(".callout-content").slideToggle(duration = 100, complete = function()
        {
            if (!isCollapsed)
            {
                $(this).parent().toggleClass("is-collapsed");
            }
        });
    });

    

    // MAKE HEADERS COLLAPSIBLE
    // if "heading-collapse-indicator" is clicked, toggle the display of every div until the next heading of the same or lower level

    function getHeadingContentsSelector(header)
    {
        let headingLevel = $(header).children().first().prop("tagName").toLowerCase();
        let headingNumber = parseInt(headingLevel.replace("h", ""));

        let endingHeadings = [1, 2, 3, 4, 5, 6].filter(function(item)
        {
            return item <= headingNumber;
        }).map(function(item)
        {
            return `div:has(h${item})`;
        });

        let endingHeadingsSelector = endingHeadings.join(", ");

        return endingHeadingsSelector;
    }

	function setHeaderCollapse(header, collapse)
	{
		let selector = getHeadingContentsSelector($(header));

        if(!collapse)
        {
			if ($(header).hasClass("is-collapsed")) $(header).toggleClass("is-collapsed");

            $(header).nextUntil(selector).show();
			
			// close headers inside of this one that are collapsed
            $(header).nextUntil(selector).each(function()
            {
				if($(this).hasClass("is-collapsed"))
					setHeaderCollapse($(this), true);
            });
			
			//open headers above this one that are collapsed
			lastHeaderSize = $(header).children().first().prop("tagName").toLowerCase().replace("h", "");
			$(header).prevAll().each(function()
			{
				if($(this).hasClass("is-collapsed") && $(this).has("h1, h2, h3, h4, h5, h6"))
				{
					let hSize = $(this).children().first().prop("tagName").toLowerCase().replace("h", "");
					if(hSize < lastHeaderSize)
					{
						setHeaderCollapse($(this), false);
						lastHeaderSize = hSize;
					}
				}
			});
        }
        else
        {
			if (!$(header).hasClass("is-collapsed")) $(header).toggleClass("is-collapsed");
            $(header).nextUntil(selector).hide();
        }
	}

    $(".heading-collapse-indicator").on("click", function()
    {
        var isCollapsed = $(this).parent().parent().hasClass("is-collapsed");
		setHeaderCollapse($(this).parent().parent(), !isCollapsed);
    });

	// open outline header when an internal link that points to that header is clicked
	$(".internal-link").on("click", function()
	{
		let target = $(this).attr("href");

		if (target.startsWith("#"))
		{
			let header = $(document.getElementById(target.substring(1)));

			setHeaderCollapse($(header).parent(), false);
		}
	});

    // MAKE OUTLINE COLLAPSIBLE
    // if "outline-header" is clicked, toggle the display of every div until the next heading of the same or lower level
    
	function setOutlineCollapse(header, collapse)
	{
		if (collapse)
		{
			if (!$(header).hasClass("is-collapsed")) 
				$(header).addClass("is-collapsed");

			$(header).children(".outline-item-children").slideUp(120);
		}
		else
		{
			if ($(header).hasClass("is-collapsed"))
				$(header).removeClass("is-collapsed");
			
			$(header).children(".outline-item-children").slideDown(120);
		}
	}

	function toggleOutlineCollapse(header)
	{
		let isCollapsed = $(header).hasClass("is-collapsed");
		setOutlineCollapse(header, !isCollapsed);
	}

    $(".outline-item-contents > .collapse-icon").on("click", function(e)
    {
        toggleOutlineCollapse($(this).parent().parent());

		// Prevent the collapse button from triggering the parent <a> tag navigation.
		// fix implented by 'zombony' from GitHub
		return false;
    });

	$(".collapse-all").on("click", function()
	{
		let button = $(this);
		$(".outline-container div.outline-item").each(function()
		{
			setOutlineCollapse($(this), !button.hasClass("is-collapsed"));
		});

		button.toggleClass("is-collapsed");

		button.find("iconify-icon").attr("icon", button.hasClass("is-collapsed") ? "ph:arrows-out-line-horizontal-bold" : "ph:arrows-in-line-horizontal-bold");
	});

    // hide the control button if the header has no children
    $(".outline-item-children:not(:has(*))").each(function()
    {
        $(this).parent().find(".collapse-icon").hide();
    });


	// Fix checkboxed toggling .is-checked
	$(".task-list-item-checkbox").on("click", function()
	{
		$(this).parent().toggleClass("is-checked");
		$(this).parent().attr("data-task", $(this).parent().hasClass("is-checked") ? "x" : " ");
	});

	$(`.plugin-tasks-list-item input[type="checkbox"]`).each(function()
	{
		$(this).prop("checked", $(this).parent().hasClass("is-checked"));
	});

	$('.kanban-plugin__item.is-complete').each(function()
	{
		$(this).find('input[type="checkbox"]').prop("checked", true);
	});

	// make code snippet block copy button copy the code to the clipboard
	$(".copy-code-button").on("click", function()
	{
		let code = $(this).parent().find("code").text();
		navigator.clipboard.writeText(code);
		$(this).text("Copied!");
		// set a timeout to change the text back
		setTimeout(function()
		{
			$(".copy-code-button").text("Copy");
		}, 2000);
	});

	let focusedNode = null;

	// make canvas nodes selectable
	$(".canvas-node-content-blocker").on("click", function()
	{
		$(this).parent().parent().toggleClass("is-focused");
		$(this).hide();

		if (focusedNode)
		{
			focusedNode.removeClass("is-focused");
			$(focusedNode).find(".canvas-node-content-blocker").show();
		}

		focusedNode = $(this).parent().parent();
	});

	// make canvas node deselect when clicking outside
	$(document).on("click", function(event)
	{
		if (!$(event.target).closest(".canvas-node").length)
		{
			$(".canvas-node").removeClass("is-focused");
			$(".canvas-node-content-blocker").show();
		}
	});

	// unhide html elements that are hidden by default
	// $("html").css("visibility", "visible");
	// $("html").css("background-color", "var(--background-primary)");
});
