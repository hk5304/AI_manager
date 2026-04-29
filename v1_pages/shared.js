document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.querySelector("[data-ai-overlay]");
  const drawer = document.querySelector("[data-ai-drawer]");
  const backButtonRoutes = {
    "project-overview.html": "./projects.html",
    "project-kanban.html": "./projects.html",
    "project-gantt.html": "./projects.html",
    "project-risk.html": "./projects.html",
    "project-members.html": "./projects.html",
    "project-reports.html": "./projects.html",
    "project-docs.html": "./projects.html",
    "task-detail.html": "./project-overview.html",
    "notifications.html": "./dashboard.html"
  };

  const getSameOriginReferrer = () => {
    if (!document.referrer) return "";
    try {
      const referrer = new URL(document.referrer);
      if (referrer.origin !== window.location.origin) return "";
      return referrer.href;
    } catch (error) {
      return "";
    }
  };

  const goBack = (fallback) => {
    const referrer = getSameOriginReferrer();
    if (referrer) {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = referrer;
      }
      return;
    }

    if (fallback) {
      window.location.href = fallback;
    }
  };

  const mountBackButton = () => {
    const pageName = window.location.pathname.split("/").pop();
    const fallback = backButtonRoutes[pageName];
    const topbarLeft = document.querySelector(".topbar-left");
    if (!fallback || !topbarLeft || topbarLeft.querySelector("[data-back-button]")) return;

    const button = document.createElement("button");
    button.className = "topbar-back-btn";
    button.type = "button";
    button.setAttribute("data-back-button", "");
    button.setAttribute("data-back-fallback", fallback);
    button.setAttribute("aria-label", "返回上一页");
    button.innerHTML = `
      <span class="material-symbols-outlined">arrow_back_ios_new</span>
      <span class="topbar-back-label">返回</span>
    `;
    topbarLeft.prepend(button);
  };

  mountBackButton();

  const closeAI = () => {
    if (!overlay || !drawer) return;
    overlay.classList.remove("open");
    drawer.classList.remove("open");
  };

  const openAI = () => {
    if (!overlay || !drawer) return;
    overlay.classList.add("open");
    drawer.classList.add("open");
  };

  document.querySelectorAll("[data-ai-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!drawer || !overlay) return;
      const isOpen = drawer.classList.contains("open");
      if (isOpen) {
        closeAI();
      } else {
        openAI();
      }
    });
  });

  if (overlay) {
    overlay.addEventListener("click", closeAI);
  }

  document.querySelectorAll("[data-ai-close]").forEach((button) => {
    button.addEventListener("click", closeAI);
  });

  document.querySelectorAll("[data-back-button]").forEach((button) => {
    button.addEventListener("click", () => {
      goBack(button.getAttribute("data-back-fallback"));
    });
  });

  document.querySelectorAll("[data-tab-group]").forEach((group) => {
    const buttons = group.querySelectorAll("[data-tab-target]");
    const panels = group.querySelectorAll("[data-tab-panel]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.getAttribute("data-tab-target");
        buttons.forEach((item) => item.classList.remove("active"));
        panels.forEach((panel) => panel.classList.remove("active"));
        button.classList.add("active");
        const activePanel = group.querySelector(`[data-tab-panel="${target}"]`);
        if (activePanel) activePanel.classList.add("active");
      });
    });
  });

  document.querySelectorAll("[data-toggle-class]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.getAttribute("data-toggle-target"));
      const className = button.getAttribute("data-toggle-class");
      if (!target || !className) return;
      target.classList.toggle(className);
      button.classList.toggle("active");
    });
  });

  const closeModal = (shell) => {
    if (!shell) return;
    shell.classList.remove("open");
  };

  const openModal = (shell) => {
    if (!shell) return;
    shell.classList.add("open");
  };

  document.querySelectorAll("[data-modal-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-modal-open");
      const shell = document.querySelector(`[data-modal-id="${target}"]`);
      openModal(shell);
    });
  });

  document.querySelectorAll("[data-modal-close]").forEach((button) => {
    button.addEventListener("click", () => {
      closeModal(button.closest("[data-modal-id]"));
    });
  });

  document.querySelectorAll("[data-modal-id]").forEach((shell) => {
    shell.addEventListener("click", (event) => {
      if (event.target === shell) {
        closeModal(shell);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    document.querySelectorAll("[data-modal-id].open").forEach((shell) => {
      closeModal(shell);
    });
  });

  const ensureToastStack = () => {
    let stack = document.querySelector("[data-toast-stack]");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      stack.setAttribute("data-toast-stack", "");
      document.body.appendChild(stack);
    }
    return stack;
  };

  const showToast = ({ title, message, icon = "check_circle" }) => {
    const stack = ensureToastStack();
    const card = document.createElement("div");
    card.className = "toast-card";
    card.innerHTML = `
      <span class="material-symbols-outlined">${icon}</span>
      <div class="toast-body">
        <strong>${title}</strong>
        <span>${message}</span>
      </div>
    `;
    stack.appendChild(card);
    setTimeout(() => {
      card.remove();
    }, 2600);
  };
  window.showToast = showToast;

  const roleTemplateData = {
    pm: {
      title: "PM 模板",
      scope: "项目内身份",
      desc: "默认用于项目负责人。允许创建项目、编辑里程碑、设置基线、导出项目报表，并可管理成员与角色分配。",
      visible: ["overview", "kanban", "gantt", "risk", "members", "reports"],
      actions: ["create-task", "assign-owner", "edit-milestone", "set-baseline", "drag-gantt", "invite-member", "export-report", "schedule-report"]
    },
    dev: {
      title: "研发模板",
      scope: "项目内身份",
      desc: "面向执行角色，强调任务创建、个人状态流转、日志与个人看板协同，默认不开放项目级导出。",
      visible: ["overview", "kanban", "gantt", "reports"],
      actions: ["create-task", "drag-gantt"]
    },
    qa: {
      title: "QA 模板",
      scope: "项目内身份",
      desc: "关注缺陷创建、验证流转与质量报表查看，适合质量保障成员的项目默认权限集合。",
      visible: ["overview", "kanban", "reports"],
      actions: ["create-task"]
    },
    collab: {
      title: "协作者模板",
      scope: "项目内身份",
      desc: "默认只读，适用于跨团队旁路协同、管理查看与周报确认场景。",
      visible: ["overview", "reports"],
      actions: []
    }
  };

  const templateModal = document.querySelector('[data-modal-id="edit-template-modal"]');
  if (templateModal) {
    const templateItems = templateModal.querySelectorAll("[data-template-key]");
    const nameInput = templateModal.querySelector("[data-template-name]");
    const scopeInput = templateModal.querySelector("[data-template-scope]");
    const descInput = templateModal.querySelector("[data-template-desc]");
    const statusNode = templateModal.querySelector("[data-template-status]");
    let currentTemplateKey = "pm";
    let dirty = false;

    const renderTemplate = (key) => {
      const template = roleTemplateData[key];
      if (!template) return;
      currentTemplateKey = key;
      templateItems.forEach((item) => {
        item.classList.toggle("active", item.getAttribute("data-template-key") === key);
      });
      if (nameInput) nameInput.value = template.title;
      if (scopeInput) scopeInput.value = template.scope;
      if (descInput) descInput.value = template.desc;
      templateModal.querySelectorAll("[data-chip-group]").forEach((chip) => {
        const group = chip.getAttribute("data-chip-group");
        const chipKey = chip.getAttribute("data-chip-key");
        const source = group === "visible" ? template.visible : template.actions;
        chip.classList.toggle("on", source.includes(chipKey));
      });
      dirty = false;
      if (statusNode) {
        statusNode.innerHTML = `<span class="material-symbols-outlined">verified</span>当前模板已同步`;
      }
    };

    templateItems.forEach((item) => {
      item.addEventListener("click", () => {
        renderTemplate(item.getAttribute("data-template-key"));
      });
    });

    templateModal.querySelectorAll("[data-chip-group]").forEach((chip) => {
      chip.addEventListener("click", () => {
        chip.classList.toggle("on");
        dirty = true;
        if (statusNode) {
          statusNode.innerHTML = `<span class="material-symbols-outlined">edit</span>存在未保存更改`;
        }
      });
    });

    [nameInput, scopeInput, descInput].forEach((input) => {
      if (!input) return;
      input.addEventListener("input", () => {
        dirty = true;
        if (statusNode) {
          statusNode.innerHTML = `<span class="material-symbols-outlined">edit</span>存在未保存更改`;
        }
      });
    });

    const saveButton = templateModal.querySelector("[data-template-save]");
    const saveAsButton = templateModal.querySelector("[data-template-save-as]");
    if (saveButton) {
      saveButton.addEventListener("click", () => {
        dirty = false;
        if (statusNode) {
          statusNode.innerHTML = `<span class="material-symbols-outlined">task_alt</span>模板已保存`;
        }
        showToast({
          title: "模板已保存",
          message: `${nameInput?.value || roleTemplateData[currentTemplateKey].title} 已更新到角色配置草稿。`,
          icon: "task_alt"
        });
      });
    }

    if (saveAsButton) {
      saveAsButton.addEventListener("click", () => {
        showToast({
          title: "已另存为新模板",
          message: `${nameInput?.value || roleTemplateData[currentTemplateKey].title} 副本已生成，可继续修改。`,
          icon: "content_copy"
        });
      });
    }

    renderTemplate("pm");
  }

  const matrixModal = document.querySelector('[data-modal-id="role-matrix-modal"]');
  if (matrixModal) {
    const exportButton = matrixModal.querySelector("[data-matrix-export]");
    if (exportButton) {
      exportButton.addEventListener("click", () => {
        showToast({
          title: "矩阵导出任务已创建",
          message: "角色功能矩阵将按当前视图导出为 PDF 草稿。",
          icon: "download"
        });
      });
    }
  }

  document.querySelectorAll("[data-switch-control]").forEach((toggle) => {
    const syncToggleState = () => {
      const isOn = toggle.classList.contains("on");
      toggle.setAttribute("aria-pressed", String(isOn));
    };

    syncToggleState();

    toggle.addEventListener("click", () => {
      toggle.classList.toggle("on");
      syncToggleState();
      const label = toggle.getAttribute("data-switch-label") || "开关";
      const isOn = toggle.classList.contains("on");
      showToast({
        title: `${label}${isOn ? "已开启" : "已关闭"}`,
        message: isOn ? "当前配置已切换为启用状态。" : "当前配置已切换为关闭状态。",
        icon: isOn ? "toggle_on" : "toggle_off"
      });
    });
  });

  document.querySelectorAll("[data-action-toast]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast({
        title: button.getAttribute("data-action-title") || "操作已执行",
        message: button.getAttribute("data-action-message") || "当前操作已触发原型反馈。",
        icon: button.getAttribute("data-action-icon") || "task_alt"
      });
    });
  });

  document.querySelectorAll("[data-reset-group]").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.getAttribute("data-reset-group");
      document.querySelectorAll(`[data-switch-group="${group}"]`).forEach((toggle) => {
        const shouldBeOn = toggle.getAttribute("data-default-on") === "true";
        toggle.classList.toggle("on", shouldBeOn);
        toggle.setAttribute("aria-pressed", String(shouldBeOn));
      });
      showToast({
        title: "已恢复默认配置",
        message: "当前系统配置已回到默认状态草稿。",
        icon: "restart_alt"
      });
    });
  });
});
